import { Request, Response } from "express";
import { Settings } from "../../models/settings";

export const settingFetchWallpaperController = async (
  req: Request,
  res: Response
) => {
  const settings = await Settings.findOne();
  res.send(settings.wallpapers);
};
