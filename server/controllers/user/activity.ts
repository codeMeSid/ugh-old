import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, UserActivity } from "@monsid/ugh";

export const userActivityController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError("Player account invalid");
  if (user.activity === UserActivity.Inactive)
    throw new BadRequestError("Player account is Inactive");

  let activity;
  if (user.activity === UserActivity.Active) activity = UserActivity.Banned;
  else activity = UserActivity.Active;

  user.set({ activity });
  await user.save();
  res.send(user);
};
