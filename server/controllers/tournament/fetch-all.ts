import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentFetchAllController = async (
  req: Request,
  res: Response
) => {
  const tournaments = await Tournament.find()
    .populate("game", "name console imageUrl thumbnailUrl", "Games")
    .sort({ startDateTime: -1 });
  res.send(tournaments);
};
