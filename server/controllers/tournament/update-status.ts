import {
  BadRequestError,
  GameType,
  timer,
  TournamentStatus,
} from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import mongoose from "mongoose";
import { User, UserDoc } from "../../models/user";
import { shuffle } from "../../utils/shuffle";
import { randomBytes } from "crypto";
import { Bracket, BracketDoc } from "../../models/bracket";
import { TournamentTime } from "../../utils/enum/tournament-time";
import { winnerLogic } from "../../utils/winner-logic";
import { mailer } from "../../utils/mailer";
import { MailerTemplate } from "../../utils/enum/mailer-template";
import { Passbook, PassbookDoc } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";
import { bracketCheckTimer } from "../../utils/bracket-check-timer";

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
      .populate("game", "gameType name cutoff", "Games")
      .session(session);
    if (!tournament) throw new BadRequestError("Tournament doesnt exist.");
    if (tournament.status !== TournamentStatus.Upcoming)
      throw new BadRequestError("Tournament status cannot be changed");

    switch (status) {
      case TournamentStatus.Cancelled:
        users = await User.find({
          _id: { $in: tournament.players },
        }).session(session);
        const passbooks: Array<PassbookDoc> = [];
        tournament.status = TournamentStatus.Completed;
        tournament.winners = users.map((u) => ({
          ughId: u.ughId,
          coins: tournament?.isFree ? 0 : tournament.coins + 10,
          position: -1,
        }));
        for (let i = 0; i < users.length; i++) {
          const tIndex = users[i].tournaments.findIndex(
            (t) => JSON.stringify(t?.id) === JSON.stringify(tournament?.id)
          );
          if (tIndex === -1) continue;
          users[i].tournaments[tIndex].didWin = true;
          users[i].tournaments[tIndex].coins = 0;
          users[i].wallet.coins =
            users[i].wallet.coins +
            (tournament?.isFree ? 0 : tournament.coins + 10);
          passbooks.push(
            Passbook.build({
              coins: tournament?.isFree ? 0 : tournament.coins + 10,
              transactionEnv: TransactionEnv.TounamentCancel,
              event: tournament?.name,
              transactionType: TransactionType.Credit,
              ughId: users[i].ughId,
            })
          );
        }
        await Promise.all([
          users?.map(async (u) => u.save({ session })),
          passbooks?.map(async (p) => p.save({ session })),
          tournament.save({ session }),
        ]);
        await session.commitTransaction();
        timer.cancel(`${tournament.regId}-end`);
        users.map((user) =>
          mailer.send(
            MailerTemplate.Cancel,
            { ughId: user.ughId, tournamentName: tournament.name },
            user.email,
            "UGH Tournament Cancelled"
          )
        );
        break;
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////

      case TournamentStatus.Started:
        tournament.winnerCoin = Math.ceil(
          ((tournament.players.length * tournament.group.participants) /
            tournament.playerCount) *
            tournament.winnerCoin
        );
        const brackets = [];
        users = shuffle(tournament.players);
        let i = 0;
        while (i < users.length) {
          const regId = randomBytes(4).toString("hex").substr(0, 5);
          const teamA = users.slice(i, i + 1);
          if (!teamA) break;
          if (tournament.game.gameType === GameType.Rank) {
            const uploadBy =
              (new Date(tournament.endDateTime).valueOf() - Date.now()) / 2;
            const bracket = Bracket.build({
              teamA: {
                user: teamA[0],
                teamMates: tournament?.teamMates
                  ? tournament?.teamMates[teamA[0]?.id] || []
                  : [],
              },
              teamB: {
                user: undefined,
              },
              gameType: tournament.game.gameType,
              regId,
              round: 1,
              uploadBy: new Date(Date.now() + uploadBy),
              gameName: tournament.game.name,
              tournamentName: tournament.name,
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
                teamMates: tournament?.teamMates
                  ? tournament?.teamMates[teamA[0]?.id] || []
                  : [],
                uploadBy: new Date(
                  Date.now() + TournamentTime.TournamentScoreUpdateTime
                ),
              },
              teamB: {
                user: teamB[0],
                score: -1,
                teamMates: tournament?.teamMates
                  ? tournament?.teamMates[teamB[0]?.id] || []
                  : [],
                uploadBy: new Date(
                  Date.now() + TournamentTime.TournamentScoreUpdateTime
                ),
              },
              round: 1,
              regId,
              gameType: tournament.game.gameType,
              gameName: tournament.game.name,
              tournamentName: tournament.name,
            });
            if (teamB.length === 0) {
              bracket.round = 2;
              bracket.teamA.uploadBy = undefined;
              bracket.teamB.uploadBy = undefined;
            } else {
              const bracketCheckTime = new Date(
                new Date(bracket.teamA.uploadBy).getTime() +
                  TournamentTime.TournamentScoreCheckTime
              );
              bracketCheckTimer(
                bracket.regId,
                bracketCheckTime,
                tournament.regId
              );
            }
            brackets.push(bracket);
            tournament.brackets.push(bracket);
            i += 2;
          }
        }
        tournament.status = TournamentStatus.Started;
        tournament.endDateTime = new Date(
          Date.now() +
            (new Date(tournament.endDateTime).valueOf() -
              new Date(tournament.startDateTime).valueOf())
        );
        tournament.startDateTime = new Date();

        await tournament.save({ session });
        await Promise.all(
          brackets?.map((b: BracketDoc) => b.save({ session }))
        );
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
          async ({ id }: { id: string }, done) => {
            try {
              const tournament = await Tournament.findById(id);
              if (!tournament)
                throw new Error("Invalid Tournament - manual start");
              if (tournament.status === TournamentStatus.Started) {
                tournament.set({ status: TournamentStatus.Completed });
                await tournament.save();
                done();
                winnerLogic(tournament.regId, null, "end");
              } else throw new Error("Tournament Status - manual start");
            } catch (error) {
              console.log({ msg: "manual start end", error: error.messsage });
              done();
            }
          },
          { id: tournament?.id }
        );
        break;
    }
  } catch (error) {
    console.log({ msg: "manual", error: error.message });
    await session.abortTransaction();
  }
  session.endSession();
  res.send(true);
};
