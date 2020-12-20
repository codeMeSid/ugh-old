import { Response, Request } from "express";
import { Sponsor } from "../../models/sponsor";
import { BadRequestError } from "@monsid/ugh-og"

export const sponsorAddController = async (req: Request, res: Response) => {
  const { email, phone, duration, price, name, color, message } = req.body;
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
    sponsorPack: {
      name,
      color,
      pack: {
        duration,
        price,
      },
    },
    message,
  });
  await sponsor.save();
  res.send(true);
};
