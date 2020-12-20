import { Request, Response } from "express";
import { Gallery } from "../../models/gallery";
import { BadRequestError } from "@monsid/ugh-og"

export const galleryUpdateActivityController = async (
  req: Request,
  res: Response
) => {
  const { galleryId } = req.params;
  const gallery = await Gallery.findById(galleryId);
  if (!gallery) throw new BadRequestError("Invalid Gallery");
  gallery.set({ isActive: !gallery.isActive });
  await gallery.save();
  res.send(gallery);
};
