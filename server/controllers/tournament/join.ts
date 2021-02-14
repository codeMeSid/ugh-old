import {
  BadRequestError,
  TournamentStatus,
  UserActivity,
} from "@monsid/ugh-og";
import { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Passbook } from "../../models/passbook";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";

export const tournamentJoinController = async (req: Request, res: Response) => {
  const { tournamentId } = req.params;
  const { id } = req.currentUser;
  const { teamPlayers }: { teamPlayers: any } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tournament = await Tournament.findById(tournamentId)
      .populate("game", "name", "Games")
      .session(session);
    const user = await User.findById(id).session(session);

    if (!tournament) throw new Error("Invalid Tournament");
    if (!user || (user && user?.activity !== UserActivity.Active))
      throw new Error("Invalid user");
    const passbook = Passbook.build({
      coins: tournament?.isFree ? 0 : tournament.coins,
      transactionEnv: TransactionEnv.TournamentJoin,
      event: tournament?.name,
      transactionType: TransactionType.Debit,
      ughId: user.ughId,
    });
    const status = tournament.status;
    if (status !== TournamentStatus.Upcoming)
      throw new Error("Cannot join tournament at this stage");
    if (
      tournament.players.filter(
        (playerId) => JSON.stringify(playerId) === JSON.stringify(id)
      ).length > 0
    )
      throw new Error("Already in tournament");
    if (
      tournament.players.length * tournament.group.participants ===
      tournament.playerCount
    )
      throw new Error("Tournament slots full");

    const walletBalance = user.wallet.coins;
    const earningBalance = user.tournaments
      .filter((t) => t.didWin && t.coins > 0)
      .reduce((acc, t) => acc + t.coins, 0);
    let fee = tournament.isFree ? 0 : tournament.coins;
    if (walletBalance >= fee) {
      user.wallet.coins -= fee;
      fee = 0;
    } else if (walletBalance + earningBalance >= fee) {
      fee -= user.wallet.coins;
      user.wallet.coins = 0;
      user.tournaments = user.tournaments.map((t) => {
        if (t.didWin && t.coins > 0 && fee > 0) {
          if (t.coins >= fee) {
            t.coins -= fee;
            fee = 0;
          } else {
            fee -= t.coins;
            t.coins = 0;
          }
        }
        return t;
      });
    } else throw new BadRequestError("Insufficient Balance");
    user.tournaments.push({
      didWin: false,
      id: tournament.id,
      coins: tournament.winnerCoin,
      name: tournament.name,
      startDateTime: tournament.startDateTime,
      endDateTime: tournament.endDateTime,
      game: tournament?.game?.name,
    });
    tournament.players.push(user);
    if (teamPlayers) {
      const team = { ...(tournament.teamMates || {}), [user.id]: teamPlayers };
      tournament.teamMates = team;
    }
    await tournament.save({ session });
    await user.save({ session });
    await passbook.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send(true);
};
