import { Request, Response } from "express";
import { Coin } from "../../models/coin";

export const coinFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const coins = await Coin.find({ isActive: true }).select("cost value");
  res.send(coins);
};
