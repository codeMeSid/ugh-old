import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentFetchAllController = async (
  req: Request,
  res: Response
) => {
  const tournaments = await Tournament.find();
  res.send(tournaments);
};
