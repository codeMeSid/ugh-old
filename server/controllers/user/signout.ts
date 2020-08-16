import { Request, Response } from "express";

export const signoutController = (req: Request, res: Response) => {
  req.session = null;
  res.send(true);
};
