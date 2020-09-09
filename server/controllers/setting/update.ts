import { Request, Response } from "express";
import { Settings } from "../../models/settings";

export const settingUpdateController = async (req: Request, res: Response) => {
  const { id } = req.body;
  const settings = await Settings.findById(id);
  settings.set(req.body);
  await settings.save();
  res.send(true);
};
