import { Response, Request } from "express";
import { Console } from "../../models/console";

export const consoleAllActiveController = async (
  req: Request,
  res: Response
) => {
  const consoles = await Console.find({ isActive: true });
  res.send(consoles);
};
