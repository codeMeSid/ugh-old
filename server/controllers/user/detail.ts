import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, UserActivity } from "@monsid/ugh";

export const userDetailController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError("Player account invalid");
  if (user.activity === UserActivity.Inactive)
    throw new BadRequestError("Player account is Inactive");
  res.send(user);
};
