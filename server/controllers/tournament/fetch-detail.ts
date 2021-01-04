import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";

export const tournamentFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  let userHasWalletBalance = true;
  let userHasEarning = true;
  const tournament = await Tournament.findOne({ regId: tournamentId })
    .populate("game", "name console imageUrl rules thumbnailUrl cutoff", "Games")
    .populate("players", "ughId uploadUrl", "Users")
    .populate("dqPlayers", "ughId uploadUrl", "Users");
  if (!tournament) throw new BadRequestError("Invalid tournament request");
  if (req.currentUser) {
    const { id } = req.currentUser;
    const user = await User.findById(id);
    if (user) {
      const walletBalance = user.wallet.coins;
      const earnings = user
        .tournaments
        .filter(t => t.didWin)
        .reduce((acc, t) => acc + t.coins, 0);
      const fee = tournament.isFree ? 0 : tournament.coins;
      userHasWalletBalance = walletBalance >= fee;
      userHasEarning = walletBalance + earnings >= fee;
    }
  }
  res.send({
    tournament
    , userHasEarning
    , userHasWalletBalance
  });
};
