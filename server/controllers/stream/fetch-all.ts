import { Request, Response } from "express";
import { Stream } from "../../models/stream";

export const streamFetchAllController = async (req: Request, res: Response) => {
  const streams = await Stream.find();
  res.send(streams);
};
