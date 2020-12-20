import { Request, Response } from "express";
import { Game } from "../../models/game";
import { BadRequestError } from "@monsid/ugh-og"

export const gameUpdateController = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) throw new BadRequestError("Game doesnt exists");
  const {
    name,
    console,
    participants,
    groups,
    imageUrl,
    thumbnailUrl,
    cutoff,
  } = req.body;

  if (name) {
    game.name = name;
  }
  if (console) {
    game.console = console;
  }
  if (participants) {
    game.participants = participants;
  }
  if (groups) {
    game.groups = groups;
  }
  if (imageUrl) {
    game.imageUrl = imageUrl;
  }
  if (thumbnailUrl) {
    game.thumbnailUrl = thumbnailUrl;
  }
  if (cutoff) {
    game.cutoff = cutoff;
  }
  await game.save();
  res.send(true);
};
