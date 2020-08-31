import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const sponsors = await Sponsor.find({
    isActive: true,
    isProccessed: true,
  }).select("name sponsorPack.color website imageUrl");
  res.send(sponsors);
};
