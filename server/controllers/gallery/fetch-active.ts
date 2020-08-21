import { Request, Response } from "express";
import { Gallery } from "../../models/gallery";

export const galleryFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const galleries = await Gallery.find({ isActive: true });
  res.send(galleries);
};
