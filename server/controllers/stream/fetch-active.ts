import { Request, Response } from "express";
import { Stream } from "../../models/stream";

export const streamFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const streams = await Stream.find({ isActive: true });
  res.send(streams);
};
