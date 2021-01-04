import { BadRequestError, TournamentStatus } from "@monsid/ugh-og"
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
    const tournament = await Tournament.findById(tournamentId).populate("game", "name", "Games").session(session);
    const user = await User.findById(id).session(session);

    if (!tournament) throw new Error("Invalid Tournament");
    if (!user) throw new Error("Invalid user");
    const passbook = Passbook.build({
      coins: tournament?.isFree ? 0 : tournament.coins,
      transactionEnv: TransactionEnv.TournamentJoin,
      event: tournament?.name,
      transactionType: TransactionType.Debit,
      ughId: user.ughId
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
    const earningBalance = user.tournaments.filter(t => t.didWin).reduce((acc, t) => acc + t.coins, 0);
    let tournamentFee = tournament.isFree ? 0 : tournament.coins;
    if (walletBalance >= tournamentFee)
      user.wallet.coins -= tournamentFee;
    else if (walletBalance + earningBalance >= tournamentFee) {
      tournamentFee -= walletBalance;
      user.wallet.coins = 0;
      if (tournamentFee > 0)
        user.tournaments = user.tournaments.map(t => {
          if (t.didWin) {
            if (t.coins >= tournamentFee) {
              t.coins -= tournamentFee;
            }
            else {
              tournamentFee -= t.coins;
              t.coins = 0;
            }
          }
          return t;
        })
    }
    else throw new BadRequestError("Insufficient Balance")
    user.tournaments.push({
      didWin: false,
      id: tournament.id,
      coins: tournament.winnerCoin,
      name: tournament.name,
      startDateTime: tournament.startDateTime,
      endDateTime: tournament.endDateTime,
      game: tournament?.game?.name
    });
    tournament.players.push(user);
    if (teamPlayers) {
      const team = { ...(tournament.teamMates || {}), [user.id]: teamPlayers }
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
