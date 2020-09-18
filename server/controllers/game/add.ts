import { Request, Response } from "express";
import { Game } from "../../models/game";
import { BadRequestError } from "@monsid/ugh";

export const gameAddController = async (req: Request, res: Response) => {
  const {
    name,
    console,
    groups,
    imageUrl,
    participants,
    thumbnailUrl,
    cutoff
  } = req.body;
  const existingGame = await Game.findOne({ name, console });
  if (existingGame) throw new BadRequestError("Game already exists");
  const game = Game.build({
    name,
    cutoff,
    console,
    groups,
    imageUrl,
    participants,
    thumbnailUrl,
  });
  await game.save();
  res.send(game);
};
