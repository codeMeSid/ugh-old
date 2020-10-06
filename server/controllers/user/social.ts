import { Request, Response } from "express";
import { User } from "../../models/user";
import { generateToken, UserActivity } from "@monsid/ugh";
import { randomBytes } from "crypto";
import { JWT_KEY } from "../../utils/env-check";

export const userSocialAuthController = async (req: Request, res: Response) => {
  const { email, uploadUrl, name } = req.body;
  let user = await User.findOne({ email, name });
  let isNew = false;
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
    isNew = true;
  }
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
  res.status(200).send(isNew);
};
