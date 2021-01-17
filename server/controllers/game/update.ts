import { Request, Response } from "express";
import { Game } from "../../models/game";
import { BadRequestError, TournamentStatus } from "@monsid/ugh-og";
import { Tournament } from "../../models/tournament";

export const gameUpdateController = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) throw new BadRequestError("Game doesnt exists");
  const tournaments = await Tournament.find({
    game,
    status: { $in: [TournamentStatus.Upcoming, TournamentStatus.Started] },
  });
  if (tournaments.length > 0)
    throw new BadRequestError(
      "This game currently is actively being played. Wait for tournaments to end"
    );
  game.set(req.body);
  await game.save();
  res.send(true);
};
