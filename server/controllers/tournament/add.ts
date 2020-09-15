import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
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
    if (!game) throw new BadRequestError("Invalid game");
    if (!settings) throw new BadRequestError("Failed to create tournament");
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
      const user = await User.findById(cUser.id).session(session);
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
      await user.save({ session });
    }

    // start tournament
    timer.schedule(
      tournament.id,
      new Date(startDateTime),
      async ({ id }: { id: string }) => {
        const tournament = await Tournament.findById(id);
        if (!tournament) return;
        if (tournament.status === TournamentStatus.Upcoming) {
          tournament.set({ status: TournamentStatus.Started });
          await tournament.save();
        }
      },
      {
        id: tournament.id,
      }
    );
    // check for match status 15mins before start
    timer.schedule(
      `${tournament.id}-15min`,
      new Date(new Date(startDateTime).valueOf() - 1000 * 60 * 15),
      async ({ id }: { id: string }) => {
        const tournament = await Tournament.findById(id);
        if (!tournament) return;
        // players joined / players required
        const attendance =
          (tournament.players.length / tournament.playerCount) * 100;
        if (
          tournament.status === TournamentStatus.Upcoming &&
          attendance < 50
        ) {
          // TODO send mail and add back coins
          tournament.set({ status: TournamentStatus.Completed });
          await tournament.save();
          timer.cancel(id);
          timer.cancel(`${id}-end`);
        }
      },
      { id: tournament.id }
    );

    // end tournament
    timer.schedule(
      `${tournament.id}-end`,
      new Date(endDateTime),
      async ({ id }: { id: string }) => {
        const tournament = await Tournament.findById(id);
        if (!tournament) return;
        if (tournament.status === TournamentStatus.Started) {
          tournament.set({ status: TournamentStatus.Completed });
          await tournament.save();
        }
      },
      { id: tournament.id }
    );
    await tournament.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  await session.endSession();
  res.send(true);
};
