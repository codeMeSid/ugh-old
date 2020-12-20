import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError } from "@monsid/ugh-og"

export const userUpdateSettingController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const user = await User.findById(id);
  if (!user) throw new BadRequestError("Invalid User");
  user.set({ settings: req.body });
  await user.save();
  res.send(user);
};
