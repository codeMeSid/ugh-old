import { Request, Response } from "express";
import { User } from "../../models/user";
import { randomBytes } from "crypto";
import { BadRequestError, UserActivity, UserRecovery } from "@monsid/ugh";

// TODO send email
export const userRecoveryController = async (req: Request, res: Response) => {
  const { data } = req.body;
  const email = data;
  const ughId = data;
  const user = await User.findOne({ $or: [{ email }, { ughId }] });
  if (!user)
    throw new BadRequestError("Player with this account doesn't exists");
  if (user.activity !== UserActivity.Active)
    throw new BadRequestError("Inactive Player account");
  const msIn1sec = 1000;
  const secIn1Min = msIn1sec * 60;
  const recovery: UserRecovery = {
    by: new Date(Date.now() + secIn1Min * 30),
    key: user.ughId.substr(0, 3) + randomBytes(4).toString("hex").substr(0, 4),
  };
  user.set({ recovery });
  await user.save();
  res.send(true);
};
