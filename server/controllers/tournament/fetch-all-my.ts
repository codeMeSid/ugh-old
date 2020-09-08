import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { TournamentStatus } from "@monsid/ugh";

export const tournamentFetchAllMyController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const tournaments = await Tournament.find({
    "addedBy.id": id,
    status: { $nin: [TournamentStatus.Cancelled] },
  }).populate("game", "name console imageUrl thumbnailUrl", "Games");
  res.send(tournaments);
};
