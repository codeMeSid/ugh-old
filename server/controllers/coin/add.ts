import { Request, Response } from "express";
import { Coin } from "../../models/coin";
import { BadRequestError } from "@monsid/ugh-og";

export const coinAddController = async (req: Request, res: Response) => {
  const { cost, value, isShopCoin } = req.body;
  const existingCoin = await Coin.findOne({
    $or: [{ cost }, { value }],
    isActive: true,
  });
  if (existingCoin) throw new BadRequestError("Coin already exists");
  const coin = Coin.build({
    cost,
    value,
    isShopCoin,
  });
  await coin.save();
  res.send(coin);
};
