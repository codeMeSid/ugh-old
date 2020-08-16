import { Request, Response } from "express";
import { User } from "../../models/user";

export const userFetchAllController = async (req: Request, res: Response) => {
  const users = await User.find();
  res.send(users);
};
