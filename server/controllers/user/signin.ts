import { Request, Response } from "express";
import { User } from "../../models/user";
import {
  BadRequestError,
  UserActivity,
  Password,
  generateToken,
} from "@monsid/ugh-og"
import { JWT_KEY } from "../../utils/env-check";

export const signinController = async (req: Request, res: Response) => {
  const { ughId, password } = req.body;
  const user = await User.findOne({ ughId });
  if (!user) throw new BadRequestError("Invalid Credentials");
  const { isSocial, activity } = user;
  if (activity !== UserActivity.Active && !isSocial)
    throw new BadRequestError("Account is inactive");
  const isPasswordValid = await Password.compare(user.password, password);
  if (!isPasswordValid) throw new BadRequestError("Invalid Credentials");
  const userJwt = generateToken(
    {
      ughId: user.ughId,
      id: user.id,
      role: user.role,
      name: user.name,
    },
    JWT_KEY!
  );
  req.session = { ...req.session, jwt: userJwt };
  res.status(200).send(user.role);
};
