import { Response, Request } from "express";
import { Console } from "../../models/console";

export const consoleAllController = async (req: Request, res: Response) => {
  const consoles = await Console.find();
  res.send(consoles);
};
