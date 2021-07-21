import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { TournamentStatus } from "@monsid/ugh-og"
import { differenceInDays } from 'date-fns';

export const tournamentFetchAllActiveController = async (
  req: Request,
  res: Response
) => {
  // const tournaments = await Tournament.find({
  //   status: { $nin: [TournamentStatus.Cancelled] },
  //   startDateTime: { $gte: new Date(addDays(startOfWeek(new Date()), 1)) },
  //   endDateTime: { $lt: new Date(addDays(endOfWeek(new Date()), 1)) }
  // }).populate("game", "name console imageUrl thumbnailUrl", "Games");
  const tournaments = await Tournament.find({
    status: { $nin: [TournamentStatus.Cancelled] }
  }, (err, ts) =>
    ts.filter(t => differenceInDays(Date.now(), t.endDateTime) < 7))
    .populate("game", "name console imageUrl thumbnailUrl", "Games");
  res.send(tournaments);
};
