import { Request, Response } from "express";
import { Stream } from "../../models/stream";

export const streamFetchAllController = async (req: Request, res: Response) => {
  const streams = await Stream.find().sort({ isActive: -1 });
  res.send(streams);
};
