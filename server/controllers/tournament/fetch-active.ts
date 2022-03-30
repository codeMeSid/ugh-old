import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { TournamentStatus } from "@monsid/ugh-og";
import { differenceInDays, subDays } from "date-fns";

export const tournamentFetchAllActiveController = async (
  req: Request,
  res: Response
) => {
  const tournaments = await Tournament.find({
    status: { $nin: [TournamentStatus.Cancelled] }
  }, (err, ts) =>
    ts.filter(t => differenceInDays(Date.now(), t.endDateTime) < 7))
    .populate("game", "name console imageUrl thumbnailUrl", "Games");
  res.send(tournaments);
};
