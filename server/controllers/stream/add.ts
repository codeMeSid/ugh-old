import { Response, Request } from "express";
import { Stream } from "../../models/stream";
import { BadRequestError, SocialTypes } from "@monsid/ugh-og"

export const streamAddController = async (req: Request, res: Response) => {
  const { name, game, href, imageUrl, social } = req.body;
  let socialType;
  switch (social) {
    case SocialTypes.Discord:
      socialType = SocialTypes.Discord;
      break;
    case SocialTypes.Twitch:
      socialType = SocialTypes.Twitch;
      break;
    case SocialTypes.Youtube:
      socialType = SocialTypes.Youtube;
      break;
    default:
      throw new BadRequestError("Social is invalid");
  }
  const existingStream = await Stream.findOne({ name, social: socialType });
  if (existingStream) throw new BadRequestError("Stream already exists");
  const stream = Stream.build({
    game,
    href,
    imageUrl,
    name,
    social: socialType,
  });
  await stream.save();
  res.send(stream);
};
