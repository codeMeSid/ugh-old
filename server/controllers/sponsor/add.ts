import { Response, Request } from "express";
import { Sponsor } from "../../models/sponsor";
import { BadRequestError } from "@monsid/ugh";

export const sponsorAddController = async (req: Request, res: Response) => {
  const { email, phone, duration, price, packName, message } = req.body;
  const existingSponsor = await Sponsor.findOne({
    $or: [{ "contact.email": email }, { "contact.phone": phone }],
  });
  if (existingSponsor)
    throw new BadRequestError("Sponsor Request already exists");
  const sponsor = Sponsor.build({
    contact: {
      email,
      phone,
    },
    pack: {
      duration,
      price,
    },
    packName,
    message,
  });
  await sponsor.save();
  res.send(true);
};
