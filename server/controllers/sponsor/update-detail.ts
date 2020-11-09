import { Request, Response } from "express";

export const sponsorUpdateDetailController = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);
  res.send(true);
};
