import { Request, Response } from "express";
import { Sponsorship } from "../../models/sponsorship";
export const sponsorshipFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const sponsorships = await Sponsorship.find({ isActive: true });
  res.send(sponsorships);
};
