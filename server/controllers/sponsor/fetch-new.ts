import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchNewController = async (
  req: Request,
  res: Response
) => {
  const { sponsorId } = req.params;
  const sponsor = await Sponsor.findOne({ sponsorId });
  res.send(sponsor);
};
