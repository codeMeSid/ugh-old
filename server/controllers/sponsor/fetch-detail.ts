import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";
import { BadRequestError } from "@monsid/ugh-og"

export const sponsorFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { sponsorId } = req.params;
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) throw new BadRequestError("Invalid sponsor");
  res.send(sponsor);
};
