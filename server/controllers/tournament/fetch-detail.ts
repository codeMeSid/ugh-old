import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const tournament = await Tournament.findOne({ regId: tournamentId })
    .populate("game", "name console imageUrl rules thumbnailUrl cutOff", "Games")
    .populate("players", "ughId uploadUrl", "Users");
  res.send(tournament);
};
