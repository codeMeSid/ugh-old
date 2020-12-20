import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";
import { BadRequestError } from "@monsid/ugh-og"

export const sponsorUpdateActivityController = async (
  req: Request,
  res: Response
) => {
  const { sponsorId } = req.params;
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) throw new BadRequestError("Sponsor doesnt exists");
  sponsor.set({ isActive: !sponsor.isActive });
  await sponsor.save();
  res.send(sponsor);
};
