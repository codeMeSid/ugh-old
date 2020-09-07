import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, UserActivity } from "@monsid/ugh";

export const userDetailController = async (req: Request, res: Response) => {
  const { ughId } = req.params;
  const user = await User.findOne({ ughId });
  if (!user) throw new BadRequestError("Player account invalid");
  res.send(user);
};
