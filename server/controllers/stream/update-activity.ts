import { Request, Response } from "express";
import { Stream } from "../../models/stream";
import { BadRequestError } from "@monsid/ugh";

export const streamUpdateActivityController = async (
  req: Request,
  res: Response
) => {
  const { streamId } = req.params;
  const stream = await Stream.findById(streamId);
  if (!stream) throw new BadRequestError("Stream not found");
  stream.set({ isActive: !stream.isActive });
  await stream.save();
  res.send(stream);
};
