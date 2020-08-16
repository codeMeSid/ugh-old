import { Request, Response } from "express";
import {
  decodeToken,
  UserPayload,
  BadRequestError,
  UserActivity,
  NotAuthorizedError,
} from "@monsid/ugh";
import { JWT_KEY } from "../../utils/env-check";
import { User } from "../../models/user";

export const activeUserController = async (req: Request, res: Response) => {
  const { activationkey } = req.params;

  const ughId = decodeToken(activationkey, JWT_KEY!) as string;

  const user = await User.findOne({ ughId });

  if (!user) throw new BadRequestError("Invalid user account");
  if (user.activity !== UserActivity.Inactive) throw new NotAuthorizedError();

  user.set({ activity: UserActivity.Active, "wallet.coins": 250 });

  await user.save();

  res.send(true);
};
