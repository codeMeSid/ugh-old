import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, UserActivity } from "@monsid/ugh";

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;
  const { coins, role } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError("Invalid account");
  if (user.activity === UserActivity.Inactive)
    throw new BadRequestError("User account inactive");
  user.set({ "wallet.coins": coins, role });
  await user.save();
  res.send(user);
};
