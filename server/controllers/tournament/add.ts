import { Request, Response } from "express";
import { Tournament, TournamentDoc } from "../../models/tournament";
import {
  timer,
  TournamentStatus,
  BadRequestError,
  UserRole,
  GameType,
} from "@monsid/ugh";
import { Game } from "../../models/game";
import mongoose from "mongoose";
import { Settings } from "../../models/settings";
import { User } from "../../models/user";
import { randomBytes } from "crypto";
import { mailer } from "../../utils/mailer";
import { MailerTemplate } from "../../utils/enum/mailer-template";
import { shuffle } from "../../utils/shuffle";
import { Bracket } from "../../models/bracket";
import { winnerLogic } from "../../utils/winner-logic";
import { TournamentTime } from "../../utils/enum/tournament-time";

export const tournamentAddController = async (req: Request, res: Response) => {
  const {
    name,
    coins,
    winnerCount,
    startDateTime,
    endDateTime,
    game: gameId,
    playerCount,
    group,
  } = req.body;

  const msIn15Mins = 1000 * 60 * 15;
  const msIn1Hr = 1000 * 60 * 60;
  const sdt = new Date(startDateTime).valueOf();
  const edt = new Date(endDateTime).valueOf();
  const cdt = new Date().valueOf();
  const wc = winnerCount;
  const pc = playerCount;
  const cUser = req.currentUser;
  const playersInGroup = group.participants;

  if (sdt <= cdt) throw new BadRequestError("Tournament cannot be in past");
  // if (sdt - cdt < msIn1Hr)
  //   throw new BadRequestError("Schedule atleast 1hr ahead");
  if (edt <= sdt) throw new BadRequestError("Cannot finish before Start");
  if (edt - sdt < msIn15Mins)
    throw new BadRequestError(
      "Tournament duration should be atleast 15 minutes"
    );
  if (wc >= pc) throw new BadRequestError("Winner cannot be more than players");
  if (playerCount % playersInGroup !== 0)
    throw new BadRequestError("Insufficient player slots");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const game = await Game.findById(gameId).session(session);
    const settings = await Settings.findOne().session(session);
    const user = await User.findById(cUser.id).session(session);
    if (!game) throw new BadRequestError("Invalid game");
    if (!settings) throw new BadRequestError("Settings not upto date");
    if (!user) throw new BadRequestError("Invalid user");
    const totalWinnings = parseInt(playerCount) * parseInt(coins);
    const earning = Math.round((settings.tournamentFees / 100) * totalWinnings);
    const winnerCoin = totalWinnings - earning;
    const tournament = Tournament.build({
      addedBy: cUser,
      coins: parseInt(coins),
      endDateTime: new Date(endDateTime),
      game,
      name,
      group,
      regId: randomBytes(4).toString("hex").substr(0, 5),
      playerCount: parseInt(playerCount),
      winnerCoin,
      startDateTime: new Date(startDateTime),
      winnerCount: parseInt(winnerCount),
    });
    tournament.coins *= tournament.group.participants;
    if (cUser.role === UserRole.Player) {
      if (!user) throw new BadRequestError("Invalid user");
      const balance = user.wallet.coins;
      const fees = tournament.coins;
      if (balance - fees < 0)
        throw new BadRequestError("Insufficient balance to create tournament");
      user.wallet.coins -= fees;
      user.tournaments.push({
        id: tournament.id,
        didWin: false,
        coins: winnerCoin,
      });
      tournament.players.push(user);
    }
    await user.save({ session });
    await tournament.save({ session });
    await session.commitTransaction();
    // start tournament
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    timer.schedule(
      tournament.regId,
      new Date(startDateTime),
      async ({ id }: { id: string }) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const tournament = await Tournament.findById(id)
            .populate("players", "email ughId settings", "Users")
            .populate("game", "gameType", "Games")
            .session(session);
          if (!tournament) return;
          if (tournament.status !== TournamentStatus.Upcoming) return;
          const users = shuffle(tournament.players);
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
              await bracket.save({ session });
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
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////

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
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
                //////////////////////////////////
              }
              await bracket.save({ session });
              tournament.brackets.push(bracket);
              i += 2;
            }
          }
          tournament.status = TournamentStatus.Started;
          await tournament.save({ session });
          await session.commitTransaction();
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
        } catch (error) {
          console.log({ m: "start", error: error.message });
          await session.abortTransaction();
        }
        session.endSession();
      },
      {
        id: tournament.id,
      }
    );
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    // timer.schedule(
    //   `${tournament.regId}-check`,
    // new Date(new Date(startDateTime).valueOf() - TournamentTime.TournamentCancelTime),
    //   async ({ id }: { id: string }) => {
    //     const session = await mongoose.startSession();
    //     await session.startTransaction();
    //     try {
    //       const tournament = await Tournament.findById(id)
    //         .populate("game", "cutoff", "Games")
    //         .session(session);
    //       if (!tournament) return;
    //       const attendance =
    //         ((tournament.players.length * tournament.group.participants) /
    //           tournament.playerCount) *
    //         100;
    //       if (
    //         tournament.status === TournamentStatus.Upcoming &&
    //         attendance < tournament.game.cutoff
    //       ) {
    //         tournament.set({ status: TournamentStatus.Completed });
    //         const users = await User.find({
    //           _id: {
    //             $in: tournament.players.map((playerId) => playerId),
    //           },
    //         }).session(session);
    //         users.map(async (user) => {
    //           user.set({
    //             "wallet.coins": user.wallet.coins + tournament.coins,
    //             tournaments: user.tournaments.filter(
    //               (tId) => JSON.stringify(tId) === JSON.stringify(tournament.id)
    //             ),
    //           });
    //           await user.save({ session });
    //         });
    //         await tournament.save({ session });
    //         await session.commitTransaction();
    //         timer.cancel(id);
    //         timer.cancel(`${id}-end`);
    //       }
    //     } catch (error) {
    //       console.log({ m: "start-15", error: error.message });
    //       await session.abortTransaction();
    //     }
    //     session.endSession();
    //   },
    //   { id: tournament.id }
    // );
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    timer.schedule(
      `${tournament.regId}-end`,
      new Date(endDateTime),
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
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    sendTournamentAddedMail(tournament);
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send(true);
};

const sendTournamentAddedMail = async (tournament: TournamentDoc) => {
  const users = await User.find({
    "settings.newTournamentWasAdded": true,
  });
  users.forEach((user) => {
    mailer.send(
      MailerTemplate.New,
      {
        ughId: user.ughId,
        tournamentName: tournament.name,
        tournamentUrl: `${process.env.BASE_URL}/tournaments/${tournament.regId}`,
      },
      user.email,
      "New UGH Tournament"
    );
  });
};
