import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const tournament = await Tournament.findById(tournamentId).populate(
    "game",
    "name console imageUrl thumbnailUrl",
    "Games"
  );
  res.send(tournament);
};
