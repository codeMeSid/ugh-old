import { Request, Response } from "express";
import { User } from "../../models/user";
import { randomBytes } from "crypto";
import { BadRequestError, UserActivity, UserRecovery } from "@monsid/ugh";
import { mailer } from "../../utils/mailer";
import { MailerTemplate } from "../../utils/enum/mailer-template";
import { BASE_URL } from "../../utils/env-check";

export const userRecoveryController = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ $or: [{ email }] });
  if (!user) throw new BadRequestError("Invalid Account");
  if (user.activity !== UserActivity.Active)
    throw new BadRequestError("Inactive Player account");
  const msIn1sec = 1000;
  const secIn1Min = msIn1sec * 60;
  const recovery: UserRecovery = {
    by: new Date(Date.now() + secIn1Min * 30),
    key: user.ughId.substr(0, 3) + randomBytes(4).toString("hex").substr(0, 4),
  };
  user.set({ recovery });
  console.log(user);
  await user.save();
  const resetLink = `${BASE_URL}/account/reset-password/${recovery.key}`;
  await mailer.send(
    MailerTemplate.ForgotPassword,
    { resetLink, ughId: user.ughId },
    user.email,
    "Reset UGH Password"
  );
  res.send(true);
};
