import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { userRole } from "../enum/user-enum";

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser || req.currentUser.role !== userRole.admin) {
    throw new NotAuthorizedError();
  }
  next();
};
