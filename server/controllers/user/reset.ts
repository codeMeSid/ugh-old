import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, NotAuthorizedError, UserActivity } from "@monsid/ugh";

export const resetUserController = async (req: Request, res: Response) => {
  const { recoverykey } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ "recovery.key": recoverykey });
  if (!user)
    throw new BadRequestError("Player with this account doesn't exists");
  if (user.activity !== UserActivity.Active)
    throw new BadRequestError("Player account Inactive");
  if (!user.recovery) throw new NotAuthorizedError();
  if (user.recovery.by.valueOf() - Date.now().valueOf() <= 0)
    throw new BadRequestError("Token is no longer valid");

  user.set({ recovery: undefined, password });
  await user.save();
  res.send(true);
};
