import { Request, Response } from "express";
import { Sponsorship } from "../../models/sponsorship";
import { BadRequestError } from "@monsid/ugh";

export const sponsorshipUpdateActivityController = async (
  req: Request,
  res: Response
) => {
  const { sponsorshipId } = req.params;
  console.log({ sponsorshipId });
  const sponsorship = await Sponsorship.findById(sponsorshipId);
  if (!sponsorship) throw new BadRequestError("Sponsorship doesnt exist");
  sponsorship.set({ isActive: !sponsorship.isActive });
  await sponsorship.save();
  res.send(sponsorship);
};
