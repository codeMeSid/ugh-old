import { Request, Response } from "express";
import { Coin } from "../../models/coin";

export const coinFetchController = async (req: Request, res: Response) => {
  const coins = await Coin.find().sort({ isActive: -1 });
  res.send(coins);
};
