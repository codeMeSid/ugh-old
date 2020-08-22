import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const sponsors = await Sponsor.find({ isActive: true });
  res.send(sponsors);
};
