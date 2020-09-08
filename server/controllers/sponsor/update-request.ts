import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";
import { BadRequestError } from "@monsid/ugh";
import { randomBytes } from "crypto";

export const sponsorProcessController = async (req: Request, res: Response) => {
  const { sponsorId } = req.params;
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) throw new BadRequestError("Sponsor invalid");
  sponsor.set({
    sponsorId: randomBytes(4).toString("hex").substr(0, 5),
    isProccessed: true,
  });
  await sponsor.save();
  // TODO send mail
  res.send({
    sponsorId: sponsor.sponsorId,
    isProccessed: sponsor.isProccessed,
  });
};
