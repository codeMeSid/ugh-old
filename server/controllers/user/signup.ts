import { Request, Response } from "express";
import { filter, BadRequestError, isValidDob } from "@monsid/ugh";
import { User } from "../../models/user";

// TODO send email
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
    dob: isValidDob(dob),
    password,
  });
  await newUser.save();
  res.status(201).send(true);
};
