import { Request, Response } from "express";
import { Game } from "../../models/game";
import { BadRequestError } from "@monsid/ugh-og"

export const gameFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) throw new BadRequestError("Game Invalid");
  res.send(game);
};
