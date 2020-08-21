import { Request, Response } from "express";
import { Sponsorship } from "../../models/sponsorship";
import { BadRequestError } from "@monsid/ugh";

export const sponsorshipUpdateController = async (
  req: Request,
  res: Response
) => {
  const { sponsorshipId } = req.params;
  const sponsorship = await Sponsorship.findById(sponsorshipId);
  if (!sponsorship) throw new BadRequestError("Sponsorship doesnt exist");
  sponsorship.set(req.body);
  await sponsorship.save();
  res.send(sponsorship);
};
