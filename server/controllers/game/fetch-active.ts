import { Request, Response } from "express";
import { Game } from "../../models/game";

export const gameFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const games = await Game.find({ isActive: true });
  res.send(games);
};
