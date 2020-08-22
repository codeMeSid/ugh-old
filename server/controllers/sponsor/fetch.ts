import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchController = async (req: Request, res: Response) => {
  const sponsors = await Sponsor.find();
  res.send(sponsors);
};
