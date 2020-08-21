import { Request, Response } from "express";
import { Sponsorship } from "../../models/sponsorship";
export const sponsorshipFetchController = async (
  req: Request,
  res: Response
) => {
  const sponsorships = await Sponsorship.find();
  res.send(sponsorships);
};
