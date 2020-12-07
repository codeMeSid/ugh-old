import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { TournamentStatus } from "@monsid/ugh";
import { startOfWeek, endOfWeek } from 'date-fns';

export const tournamentFetchAllActiveController = async (
  req: Request,
  res: Response
) => {
  const tournaments = await Tournament.find({
    status: { $nin: [TournamentStatus.Cancelled] },
    startDateTime: { $gte: new Date(startOfWeek(new Date())) },
    endDateTime: { $lt: new Date(endOfWeek(new Date())) }
  }).populate("game", "name console imageUrl thumbnailUrl", "Games");
  res.send(tournaments);
};
