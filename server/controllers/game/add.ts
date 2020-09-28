import { Request, Response } from "express";
import { Game } from "../../models/game";
import { BadRequestError, GameType } from "@monsid/ugh";

export const gameAddController = async (req: Request, res: Response) => {
  const {
    name,
    console,
    groups,
    imageUrl,
    participants,
    thumbnailUrl,
    cutoff,
    gameType,
    winners,
  } = req.body;
  const existingGame = await Game.findOne({ name, console });
  if (existingGame) throw new BadRequestError("Game already exists");
  let type;
  switch (gameType) {
    case "rank":
      type = GameType.Rank;
      break;
    case "score":
      type = GameType.Score;
      break;
  }
  const game = Game.build({
    name,
    cutoff,
    console,
    groups,
    imageUrl,
    participants,
    thumbnailUrl,
    gameType: type,
    winners,
  });
  await game.save();
  res.send(game);
};
