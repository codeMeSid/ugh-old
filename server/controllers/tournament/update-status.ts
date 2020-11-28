import {
  BadRequestError,
  GameType,
  timer,
  TournamentStatus,
} from "@monsid/ugh";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import mongoose from "mongoose";
import { User, UserDoc } from "../../models/user";
import { shuffle } from "../../utils/shuffle";
import { randomBytes } from "crypto";
import { Bracket } from "../../models/bracket";
import { TournamentTime } from "../../utils/enum/tournament-time";
import { winnerLogic } from "../../utils/winner-logic";
import { mailer } from "../../utils/mailer";
import { MailerTemplate } from "../../utils/enum/mailer-template";

export const tournamentUpdateStatusController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const { status } = req.body;
  const session = await mongoose.startSession();
  let users: Array<UserDoc>;
  session.startTransaction();
  try {
    const tournament = await Tournament.findById(tournamentId)
      .populate("players", "email ughId settings", "Users")
      .populate("game", "gameType cutoff", "Games")
      .session(session);
    if (!tournament) throw new BadRequestError("Tournament doesnt exist.");
    if (tournament.status !== TournamentStatus.Upcoming)
      throw new BadRequestError("Tournament status cannot be changed");

    switch (status) {
      case TournamentStatus.Cancelled:
        users = await User.find({
          _id: { $in: tournament.players },
        }).session(session);
        tournament.status = TournamentStatus.Completed;
        tournament.winners = users.map((u) => ({
          ughId: u.ughId,
          coins: tournament.coins + 10,
          position: -1,
        }));
        for (let i = 0; i < users.length; i++) {
          const tIndex = users[i].tournaments.findIndex(
            (t) => JSON.stringify(t.id) === JSON.stringify(tournament.id)
          );
          if (tIndex === -1) continue;
          users[i].tournaments[tIndex].didWin = true;
          users[i].tournaments[tIndex].coins = 0;
          users[i].wallet.coins = users[i].wallet.coins + tournament.coins + 10;
        }
        await Promise.all([
          users.map(async (u) => await u.save({ session })),
          tournament.save({ session }),
        ]);
        await session.commitTransaction();
        break;

      case TournamentStatus.Started:
        const brackets = [];
        users = shuffle(tournament.players);
        let i = 0;
        while (i < users.length) {
          const regId = randomBytes(4).toString("hex").substr(0, 5);
          const teamA = users.slice(i, i + 1);
          if (!teamA) break;
          if (tournament.game.gameType === GameType.Rank) {
            const bracket = Bracket.build({
              teamA: {
                user: teamA[0],
              },
              teamB: {
                user: undefined,
              },
              gameType: tournament.game.gameType,
              regId,
              round: 1,
              uploadBy: new Date(
                Date.now() + TournamentTime.TournamentRankUpdateTime
              ),
            });
            brackets.push(bracket);
            tournament.brackets.push(bracket);
            i += 1;
          } else if (tournament.game.gameType === GameType.Score) {
            const teamB = users.slice(i + 1, i + 2);
            const bracket = Bracket.build({
              teamA: {
                user: teamA[0],
                score: -1,
                uploadBy: new Date(
                  Date.now() + TournamentTime.TournamentScoreUpdateTime
                ),
              },
              teamB: {
                user: teamB[0],
                score: -1,
                uploadBy: new Date(
                  Date.now() + TournamentTime.TournamentScoreUpdateTime
                ),
              },
              round: 1,
              regId,
              gameType: tournament.game.gameType,
            });
            if (teamB.length === 0) {
              bracket.round = 2;
              bracket.teamA.uploadBy = undefined;
              bracket.teamB.uploadBy = undefined;
            } else {
              const bracketCheckTimer = new Date(
                new Date(bracket.teamA.uploadBy).getTime() +
                  TournamentTime.TournamentScoreCheckTime
              );
              timer.schedule(
                `${bracket.regId}-check`,
                bracketCheckTimer,
                async ({ regId, tournamentId }) => {
                  const bracket = await Bracket.findOne({ regId });
                  if (!bracket) return;
                  const {
                    teamA: { score: sA },
                    teamB: { score: sB },
                    winner,
                  } = bracket;
                  if (winner) return;
                  if (sA !== -1 || sB !== -1) return;
                  winnerLogic(tournamentId, regId, "score check timer");
                },
                { regId: bracket.regId, tournamentId: tournament.regId }
              );
            }
            brackets.push(bracket);
            tournament.brackets.push(bracket);
            i += 2;
          }
        }
        tournament.status = TournamentStatus.Started;
        tournament.startDateTime = new Date();

        await Promise.all([
          tournament.save({ session }),
          brackets.map(async (b) => await b.save({ session })),
        ]);
        await session.commitTransaction();
        timer.cancel(tournament.regId);
        timer.cancel(`${tournament.regId}-end`);
        users.forEach((user) => {
          if (user.settings.addedTournamentWillStart)
            mailer.send(
              MailerTemplate.Start,
              {
                ughId: user.ughId,
                tournamentName: tournament.name,
              },
              user.email,
              `Tournament ${tournament.name} Started`
            );
        });
        timer.schedule(
          `${tournament.regId}-end`,
          new Date(tournament.endDateTime),
          async ({ id }: { id: string }) => {
            try {
              const tournament = await Tournament.findById(id);
              if (!tournament) return;
              if (tournament.status === TournamentStatus.Started) {
                tournament.set({ status: TournamentStatus.Completed });
                await tournament.save();
              }
              winnerLogic(tournament.regId, null, "end");
            } catch (error) {
              console.log({ m: "end", error: error.message });
            }
          },
          { id: tournament.id }
        );
        break;
    }
  } catch (error) {
    console.log({ msg: "cancel", error: error.message });
    await session.abortTransaction();
  }
  session.endSession();
  res.send(true);
};
