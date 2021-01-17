import { NotAuthorizedError } from "@monsid/ugh-og";
import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user";

export const requireSuperAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.currentUser;
  const user = await User.findById(id);
  if (!user) throw new NotAuthorizedError();
  if (user.isSuperAdmin !== id) throw new NotAuthorizedError();
  next();
};
