import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { timer, TournamentStatus } from "@monsid/ugh";
import { Game } from "../../models/game";

export const tournamentAddController = async (req: Request, res: Response) => {
  const {
    name,
    coins,
    winnerCount,
    startDateTime,
    endDateTime,
    game: gameId,
    playerCount,
    group,
  } = req.body;

  // TODO coin deduction logic

  const game = await Game.findById(gameId);
  const tournament = Tournament.build({
    addedBy: req.currentUser,
    coins: parseInt(coins),
    endDateTime: new Date(endDateTime),
    game,
    name,
    playerCount: parseInt(playerCount),
    startDateTime: new Date(startDateTime),
    winnerCount: parseInt(winnerCount),
  });
  await tournament.save();
  // upcoming -> started
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
  // upcoming -> cancel
  // 15 mins before start
  timer.schedule(
    `${tournament.id}${tournament.id}`,
    new Date(tournament.startDateTime.valueOf() - 1000 * 60 * 15),
    async ({ id }: { id: string }) => {
      const tournament = await Tournament.findById(id);
      if (!tournament) return;
      // players joined / players required
      const attendance =
        (tournament.players.length / tournament.playerCount) * 100;
      if (tournament.status === TournamentStatus.Upcoming && attendance < 50) {
        tournament.set({ status: TournamentStatus.Completed });
        await tournament.save();
      }
    },
    {
      id: tournament.id,
    }
  );
  // started -> completed
  timer.schedule(
    `${tournament.id}${tournament.id}`,
    tournament.endDateTime,
    async ({ id }: { id: string }) => {
      const tournament = await Tournament.findById(id);
      if (!tournament) return;
      if (tournament.status === TournamentStatus.Started) {
        tournament.set({ status: TournamentStatus.Completed });
        await tournament.save();
      }
    },
    {
      id: tournament.id,
    }
  );
  res.send(true);
};
