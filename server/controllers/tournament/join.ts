import { BadRequestError, TournamentStatus } from "@monsid/ugh";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";

export const tournamentJoinController = async (req: Request, res: Response) => {
  const { tournamentId } = req.params;
  const { id } = req.currentUser;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tournament = await Tournament.findById(tournamentId).session(session);
    const user = await User.findById(id).session(session);
    if (!tournament) throw new Error("Invalid Tournament");
    if (!user) throw new Error("Invalid user");
    const status = tournament.status;
    if (status !== TournamentStatus.Upcoming)
      throw new Error("Cannot join tournament at this stage");
    if (
      tournament.players.filter(
        (playerId) => JSON.stringify(playerId) === JSON.stringify(id)
      ).length > 0
    )
      throw new Error("Already in tournament");
    if (tournament.players.length === tournament.playerCount)
      throw new Error("Tournament slots full");
    if (user.wallet.coins - tournament.coins < 0)
      throw new Error("Insufficient coins in account to enter tournament");
    user.set({ "wallet.coins": user.wallet.coins - tournament.coins });
    tournament.players.push(user);
    await tournament.save({ session });
    await user.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send(true);
};
