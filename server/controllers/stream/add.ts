import { Response, Request } from "express";
import { Stream } from "../../models/stream";
import { BadRequestError, SocialTypes } from "@monsid/ugh";

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