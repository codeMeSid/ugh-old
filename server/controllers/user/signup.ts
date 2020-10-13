import { Request, Response } from "express";
import { filter, BadRequestError } from "@monsid/ugh";
import { User } from "../../models/user";
import { mailer } from "../../utils/mailer";
import { MailerTemplate } from "../../utils/enum/mailer-template";

export const signupController = async (req: Request, res: Response) => {
  const { ughId, name, email, dob, password } = req.body;
  filter.isUnfit({ email });
  filter.isUnfit({ name });
  filter.isUnfit({ ughId });
  const preUser = await User.findOne({ $or: [{ email }, { ughId }] });
  if (preUser) throw new BadRequestError("User already exists");
  const newUser = User.build({
    email,
    name,
    ughId,
    dob,
    password,
  });
  await newUser.save();
  mailer.send(
    MailerTemplate.Activate,
    {
      href: `${process.env.BASE_URL}/account/activate/${newUser.ughId}`,
      ughId: newUser.ughId,
    },
    newUser.email,
    "UGH Registeration"
  );
  res.status(201).send(true);
};
