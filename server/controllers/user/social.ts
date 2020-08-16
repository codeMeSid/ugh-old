import { Request, Response } from "express";
import { User } from "../../models/user";
import { generateToken } from "@monsid/ugh";
import { randomBytes } from "crypto";
import { JWT_KEY } from "../../utils/env-check";

// TODO send email
export const userSocialAuthController = async (req: Request, res: Response) => {
  const { email, uploadUrl, name } = req.body;
  let user = await User.findOne({ email, name });
  if (!user) {
    const ughId =
      `${name}`.trim().toLowerCase().substr(0, 3) +
      randomBytes(4).toString("hex").substr(0, 4);
    user = User.build({
      email,
      uploadUrl,
      name,
      ughId,
    });
    user.isSocial = true;
    await user.save();
  }
  const userJwt = generateToken(
    {
      email: user.email,
      id: user.id,
      role: user.role,
      name: user.name,
    },
    JWT_KEY!
  );
  req.session = { ...req.session, jwt: userJwt };
  res.status(200).send(user.role);
};
