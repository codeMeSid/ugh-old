import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const tournament = await Tournament.findOne({ regId: tournamentId })
    .populate("game", "name console imageUrl rules thumbnailUrl cutoff", "Games")
    .populate("players", "ughId uploadUrl", "Users")
    .populate("dqPlayers", "ughId uploadUrl", "Users");
  if (!tournament) throw new BadRequestError("Invalid tournament request");
  res.send(tournament);
};
