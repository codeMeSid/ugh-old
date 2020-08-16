import { Response, Request } from "express";
import { Console } from "../../models/console";
import { BadRequestError } from "@monsid/ugh";

export const consoleAddController = async (req: Request, res: Response) => {
  const { name } = req.body;
  const existingConsole = await Console.findOne({ name });
  if (!existingConsole) throw new BadRequestError("Console already exists");
  const console = Console.build({ name });
  await console.save();
  res.send(console);
};
