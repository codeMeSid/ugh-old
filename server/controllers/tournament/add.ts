import { Request, Response } from "express";
import { Tournament, TournamentDoc } from "../../models/tournament";
import {
  timer,
  TournamentStatus,
  BadRequestError,
  UserRole,
} from "@monsid/ugh";
import { Game } from "../../models/game";
import mongoose from "mongoose";
import { Settings } from "../../models/settings";
import { User } from "../../models/user";
import { randomBytes } from "crypto";
import { mailer } from "../../utils/mailer";
import { MailerTemplate } from "../../utils/mailer-template";
import { shuffle } from "../../utils/shuffle";
import { Bracket } from "../../models/bracket";

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

  if (sdt <= cdt) throw new BadRequestError("Tournament cannot be in past");
  if (sdt - cdt < msIn1Hr)
    throw new BadRequestError("Schedule atleast 1hr ahead");
  if (edt <= sdt) throw new BadRequestError("Cannot finish before Start");
  if (edt - sdt < msIn15Mins)
    throw new BadRequestError(
      "Tournament duration should be atleast 15 minutes"
    );
  if (wc >= pc) throw new BadRequestError("Winner cannot be more than players");

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const game = await Game.findById(gameId).session(session);
    const settings = await Settings.findOne().session(session);
    const user = await User.findById(cUser.id).session(session);
    if (!game) throw new BadRequestError("Invalid game");
    if (!settings) throw new BadRequestError("Failed to create tournament");
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
      tournament.id,
      new Date(startDateTime),
      async ({ id }: { id: string }) => {
        const session = await mongoose.startSession();
        try {
          const tournament = await Tournament.findById(id)
            .populate("players", "email ughId settings", "Users")
            .session(session);
          if (!tournament) return;
          if (tournament.status !== TournamentStatus.Upcoming) return;
          const users = shuffle(tournament.players);
          const playersInTeam = tournament.group.participants;
          let i = 0;
          while (i < users.length) {
            const teamA = users.slice(i, i + playersInTeam);
            const teamB = users.slice(i + playersInTeam, i + 2 * playersInTeam);
            if (teamA.length === 0) break;
            if (teamA.length > 0 && teamA.length < playersInTeam) {
              // TODO TBD
            }
            const bracket = Bracket.build({
              teamA: {
                users: teamA,
              },
              teamB: {
                users: teamB,
              },
              round: 1,
            });
            if (teamB.length === 0) {
              bracket.round = 2;
            }
            if (teamB.length > 0 && teamB.length < playersInTeam) {
              // TODO TBD
              // break;
            }
            await bracket.save({ session });
            tournament.brackets.push(bracket);
            i += 2 * playersInTeam;
          }
          tournament.status = TournamentStatus.Started;
          await tournament.save({ session });
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
          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          console.log({ m: "start", error: error.message });
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

    timer.schedule(
      `${tournament.id}-15min`,
      new Date(new Date(startDateTime).valueOf() - 1000 * 60 * 15),
      async ({ id }: { id: string }) => {
        const session = await mongoose.startSession();
        try {
          const tournament = await Tournament.findById(id)
            .populate("game", "cutoff", "Games")
            .session(session);
          if (!tournament) return;
          const attendance =
            (tournament.players.length / tournament.playerCount) * 100;
          if (
            tournament.status === TournamentStatus.Upcoming &&
            attendance < tournament.game.cutoff
          ) {
            tournament.set({ status: TournamentStatus.Completed });
            const users = await User.find({
              _id: {
                $in: tournament.players.map((playerId) => playerId),
              },
            }).session(session);
            users.map(async (user) => {
              user.set({
                "wallet.coins": user.wallet.coins + tournament.coins,
                tournaments: user.tournaments.filter(
                  (tId) => JSON.stringify(tId) === JSON.stringify(tournament.id)
                ),
              });
              await user.save({ session });
            });
            await tournament.save({ session });
            await session.commitTransaction();
            timer.cancel(id);
            timer.cancel(`${id}-end`);
          }
        } catch (error) {
          await session.abortTransaction();
          console.log({ m: "start-15", error: error.message });
        }
        session.endSession();
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
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    timer.schedule(
      `${tournament.id}-end`,
      new Date(endDateTime),
      async ({ id }: { id: string }) => {
        try {
          const tournament = await Tournament.findById(id);
          if (!tournament) return;
          if (tournament.status === TournamentStatus.Started) {
            tournament.set({ status: TournamentStatus.Completed });
            await tournament.save();
          }
        } catch (error) {
          console.log({ m: "end", error: error.message });
          console.log("end");
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
