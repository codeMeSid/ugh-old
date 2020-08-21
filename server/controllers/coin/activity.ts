import { Request, Response } from "express";
import { Coin } from "../../models/coin";
import { BadRequestError } from "@monsid/ugh";

export const coinUpdateActivityController = async (
  req: Request,
  res: Response
) => {
  const { coinId } = req.params;
  const coin = await Coin.findById(coinId);
  if (!coin) throw new BadRequestError("Invalid Coin");
  coin.set({ isActive: !coin.isActive });
  await coin.save();
  res.send(coin);
};
