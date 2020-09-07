import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchController = async (req: Request, res: Response) => {
  const sponsors = await Sponsor.find()
    .sort({ isProccessed: 1, isActive: -1, sponsorId: -1 })
    .select("name sponsorPack contact isProccessed sponsorId isActive");
  res.send(sponsors);
};
