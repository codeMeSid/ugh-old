import { Request, Response } from "express";
import { User } from "../../models/user";

export const userFetchAllMessengerController = async (
  req: Request,
  res: Response
) => {
  const users = await User.find()
    .sort({ activity: -1 })
    .select("ughId uploadUrl");
  res.send(users);
};
