import { BadRequestError } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { Settings } from "../../models/settings";

export const settingTypeFetchController = async (
  req: Request,
  res: Response
) => {
  const { type } = req.params;
  const settings = await Settings.findOne();
  if (settings) res.send(settings.get(type));
  else throw new BadRequestError("Setting not found");
};
