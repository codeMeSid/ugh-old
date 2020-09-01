import { Request, Response } from "express";
import { Gallery } from "../../models/gallery";

export const galleryFetchController = async (req: Request, res: Response) => {
  const galleries = await Gallery.find().sort({ isActive: -1 });
  res.send(galleries);
};
