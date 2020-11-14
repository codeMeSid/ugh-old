import { BadRequestError } from "@monsid/ugh";
import { Request, Response } from "express";
import { Sponsor } from "../../models/sponsor";

export const sponsorFetchNewController = async (
  req: Request,
  res: Response
) => {
  const { sponsorId } = req.params;
  const sponsor = await Sponsor.findOne({ sponsorId });
  if (!sponsor)
    throw new BadRequestError(
      "Url has expired,kindly Contact admin to get new url."
    );
  res.send(sponsor);
};
