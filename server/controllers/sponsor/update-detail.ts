import { BadRequestError } from "@monsid/ugh";
import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorUpdateDetailController = async (
  req: Request,
  res: Response
) => {
  const {
    params: { sponsorId },
    body,
  } = req;

  const sponsor = await Sponsor.findOne({ sponsorId });
  if (!sponsor)
    throw new BadRequestError("Invalid Request, Contact Admin for more info.");

  sponsor.set(body);
  sponsor.sponsorId = null;
  sponsor.isActive = true;
  await sponsor.save();
  res.send(true);
};
