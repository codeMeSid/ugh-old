import { Response, Request } from "express";
import { Console } from "../../models/console";
import { BadRequestError } from "@monsid/ugh";

export const consoleActivityController = async (
  req: Request,
  res: Response
) => {
  const { consoleId } = req.params;
  const existingConsole = await Console.findById(consoleId);
  if (!existingConsole) throw new BadRequestError("Console is invalid");
  existingConsole.set({ isActive: !existingConsole.isActive });
  await existingConsole.save();
  res.send(existingConsole);
};
