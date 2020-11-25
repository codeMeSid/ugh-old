import { BadRequestError, TournamentStatus } from "@monsid/ugh";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentUpdateStatusController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const { status } = req.body;
  if (status === TournamentStatus.Completed)
    throw new BadRequestError("Cannot complete tournament at this stage.");
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new BadRequestError("Tournament doesnt exist.");
  if (
    tournament.status === TournamentStatus.Upcoming &&
    status === TournamentStatus.Cancelled
  ) {
    tournament.set({ status });
    await tournament.save();
  } else throw new BadRequestError("Tournament status cannot be changed.");
  res.send(true);
};
