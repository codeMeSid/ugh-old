import {
  BadRequestError,
  generateToken,
  isValidDob,
  UserActivity,
} from "@monsid/ugh-og";
import { Request, Response } from "express";
import { User } from "../../models/user";
import { JWT_KEY } from "../../utils/env-check";
import { filter } from "../../utils/profanity-filter";

export const userSocialActivateController = async (
  req: Request,
  res: Response
) => {
  const { ughId } = req.params;
  const { mobile, dob, country, state } = req.body;
  isValidDob(dob);
  filter.isUnfit({ mobile });

  const user = await User.findOne({ ughId });
  if (!user) throw new BadRequestError("Invalid User Operation");
  if (user.activity !== UserActivity.Inactive)
    throw new BadRequestError("User Account already active/banned");
  user.activity = UserActivity.Active;
  user.mobile = mobile;
  user.address.state = state;
  user.address.country = country;
  user.dob = new Date(dob);
  user.wallet.coins = 250;
  await user.save();
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
  res.send(true);
};
