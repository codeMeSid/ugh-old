import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { TournamentStatus } from "@monsid/ugh";

export const tournamentFetchAllActiveController = async (
  req: Request,
  res: Response
) => {
  const tournaments = await Tournament.find({
    status: { $nin: [TournamentStatus.Cancelled] },
  }).populate("game", "name console imageUrl thumbnailUrl", "Games");
  res.send(tournaments);
};
