import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { timer, TournamentStatus, BadRequestError } from "@monsid/ugh";
import { Game } from "../../models/game";
import { randomBytes } from "crypto";

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

  if (winnerCount >= playerCount)
    throw new BadRequestError("Winner cannot be more than players");

  if (Math.abs(Date.now() - new Date(startDateTime).valueOf()) < 1000 * 60 * 60)
    throw new BadRequestError("Schedule tournament atleat 1 hr ahead");

  if (
    Math.abs(
      new Date(endDateTime).valueOf() - new Date(startDateTime).valueOf()
    ) <
    1000 * 60 * 15
  )
    throw new BadRequestError(
      "Tournament duration should be atleast 15 minutes"
    );
  const game = await Game.findById(gameId);
  const tournament = Tournament.build({
    addedBy: req.currentUser,
    coins: parseInt(coins),
    endDateTime: new Date(endDateTime),
    game,
    name,
    group,
    playerCount: parseInt(playerCount),
    startDateTime: new Date(startDateTime),
    winnerCount: parseInt(winnerCount),
  });
  await tournament.save();

  startTournamentTimer(tournament.id, tournament.startDateTime);
  start15MinCheckTournamentTimer(tournament.id, tournament.startDateTime);
  endTournamentTimer(tournament.id, tournament.endDateTime);

  res.send(true);
};

const startTournamentTimer = (id: string, startDateTime: Date) => {
  timer.schedule(
    id,
    new Date(startDateTime),
    async ({ id }: { id: string }) => {
      const tournament = await Tournament.findById(id);
      if (!tournament) return;
      if (tournament.status === TournamentStatus.Upcoming) {
        tournament.set({ status: TournamentStatus.Started });
        await tournament.save();
      }
    },
    {
      id,
    }
  );
};

const start15MinCheckTournamentTimer = (id: string, startDateTime: Date) => {
  const check15MinStartId = `${id}-${randomBytes(4)
    .toString("hex")
    .substr(0, 4)}`;
  timer.schedule(
    check15MinStartId,
    new Date(startDateTime.valueOf() - 1000 * 60 * 15),
    async ({ id }: { id: string }) => {
      const tournament = await Tournament.findById(id);
      if (!tournament) return;
      // players joined / players required
      const attendance =
        (tournament.players.length / tournament.playerCount) * 100;
      if (tournament.status === TournamentStatus.Upcoming && attendance < 50) {
        tournament.set({ status: TournamentStatus.Cancelled });
        await tournament.save();
      }
    },
    { id }
  );
};

const endTournamentTimer = (id: string, endDateTime: Date) => {
  const endId = `${id}-${randomBytes(4).toString("hex").substr(0, 5)}`;
  timer.schedule(
    endId,
    endDateTime,
    async ({ id }: { id: string }) => {
      const tournament = await Tournament.findById(id);
      if (!tournament) return;
      if (tournament.status === TournamentStatus.Started) {
        tournament.set({ status: TournamentStatus.Completed });
        await tournament.save();
      }
    },
    { id }
  );
};
