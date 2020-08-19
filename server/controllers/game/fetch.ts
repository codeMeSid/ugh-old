import { Request, Response } from "express";
import { Game } from "../../models/game";

export const gameFetchController = async (req: Request, res: Response) => {
  const games = await Game.find();
  res.send(games);
};
