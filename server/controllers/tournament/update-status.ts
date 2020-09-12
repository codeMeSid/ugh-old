import { BadRequestError, TournamentStatus } from "@monsid/ugh";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const tournamentUpdateStatusController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const { status } = req.body;
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new BadRequestError("Tournament doesnt exist");
  switch (tournament.status) {
    case TournamentStatus.Upcoming:
      if (status === TournamentStatus.Completed)
        throw new BadRequestError(
          "Tournament can only be started or cancelled at this stage"
        );
      break;
    case TournamentStatus.Started:
      if (status === TournamentStatus.Upcoming)
        throw new BadRequestError(
          "Tournament cannot be scheduled after starting"
        );
      break;
    case TournamentStatus.Completed:
      throw new BadRequestError("Tournament status cannot be changed");
    case TournamentStatus.Cancelled:
      throw new BadRequestError("Tournament status cannot be changed");
  }
  tournament.set({ status });
  await tournament.save();
  res.send(true);
};
