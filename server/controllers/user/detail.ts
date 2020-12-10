import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, UserActivity } from "@monsid/ugh";
import { Passbook } from "../../models/passbook";

export const userDetailController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError("Player account invalid");
  const passbook = await Passbook.find({ ughId: user.ughId });
  const userObj = { ...user.toObject(), passbook }
  res.send(userObj);
};
