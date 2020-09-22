import { Request, Response } from "express";
import { BadRequestError, UserActivity } from "@monsid/ugh";
import { User } from "../../models/user";

export const activeUserController = async (req: Request, res: Response) => {
  const { ughId } = req.params;
  const user = await User.findOne({ ughId });
  if (!user) throw new BadRequestError("Invalid user account");
  if (user.activity === UserActivity.Banned)
    throw new BadRequestError("This account has been banned");
  if (user.isSocial) throw new BadRequestError("This is a social account");
  if (user.activity === UserActivity.Active)
    throw new BadRequestError("Account is already active, Nice try!!! :)");
  user.set({ activity: UserActivity.Active, "wallet.coins": 250 });
  await user.save();
  res.send(user.ughId);
};
