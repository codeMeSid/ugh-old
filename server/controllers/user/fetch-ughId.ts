import { UserActivity } from "@monsid/ugh";
import { Request, Response } from "express";
import { User } from "../../models/user";

export const userFetchUghIdController = async (req: Request, res: Response) => {
  const users = await User.find({ activity: UserActivity.Active }).select(
    "ughId"
  );
  res.send(users);
};
