import { Request, Response } from "express";

export const currentUserController = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};
