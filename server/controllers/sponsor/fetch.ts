import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchController = async (req: Request, res: Response) => {
  const sponsors = await Sponsor.find()
    .sort({ isActive: -1, isProccessed: 1 })
    .select("name sponsorPack contact isProccessed isActive");
  res.send(sponsors);
};
