import { Request, Response } from "express";
import { Sponsorship } from "../../models/sponsorship";
import { BadRequestError } from "@monsid/ugh-og"

export const sponsorshipAddController = async (req: Request, res: Response) => {
  const { name, color, packs, description } = req.body;
  const existingSponsorshipPack = await Sponsorship.findOne({
    $or: [{ name }, { color }],
  });
  if (existingSponsorshipPack && existingSponsorshipPack.isActive === true)
    throw new BadRequestError("sponsorship pack already exists");
  const sponsorship = Sponsorship.build({
    name,
    color,
    packs,
    description,
  });
  await sponsorship.save();
  res.send(sponsorship);
};
