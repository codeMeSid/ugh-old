import { Request, Response } from "express";
import { Coin } from "../../models/coin";
import { BadRequestError } from "@monsid/ugh";

export const coinUpdateController = async (req: Request, res: Response) => {
  const { coinId } = req.params;
  const { cost } = req.body;
  const coin = await Coin.findById(coinId);
  if (!coin) throw new BadRequestError("Invalid Coin");
  coin.set({ cost });
  await coin.save();
  res.send(coin);
};
