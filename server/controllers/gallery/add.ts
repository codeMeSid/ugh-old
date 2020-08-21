import { Request, Response } from "express";
import { Gallery } from "../../models/gallery";

export const galleryAddController = async (req: Request, res: Response) => {
  const { name, imageUrl } = req.body;
  const gallery = Gallery.build({
    name,
    imageUrl,
  });
  await gallery.save();
  res.send(gallery);
};
