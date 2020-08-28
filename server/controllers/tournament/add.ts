import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { timer, TournamentStatus } from "@monsid/ugh";

export const tournamentAddController = async (req: Request, res: Response) => {
  const {
    name,
    coins,
    console,
    game,
    playerCount,
    startDateTime,
    endDateTime,
    winnerCount,
  } = req.params;

  // TODO coin deduction logic

  const tournament = Tournament.build({
    addedBy: req.currentUser,
    coins: parseInt(coins),
    console,
    endDateTime: new Date(endDateTime),
    game,
    name,
    playerCount: parseInt(playerCount),
    startDateTime: new Date(startDateTime),
    winnerCount: parseInt(winnerCount),
  });
  await tournament.save();
  timer.schedule(
    tournament.id,
    tournament.startDateTime,
    async ({ id }: { id: string }) => {
      const tournament = await Tournament.findById(id);
      if (!tournament) return;
      if (tournament.status === TournamentStatus.Upcoming) {
        tournament.set({ status: TournamentStatus.Started });
        await tournament.save();
      }
    },
    {
      id: tournament.id,
    }
  );
  res.send(tournament);
};
