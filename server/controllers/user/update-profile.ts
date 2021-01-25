import { Request, Response } from "express";
import { User } from "../../models/user";
import {
  BadRequestError,
  NotAuthorizedError,
  UserActivity,
} from "@monsid/ugh-og";
import { Passbook, PassbookDoc } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";
import { differenceInCalendarYears } from "date-fns";

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  const { ughId } = req.params;
  const { id } = req.currentUser;
  const { coins, role, dob, mobile, email } = req.body;
  const user = await User.findOne({ ughId });
  if (!user) throw new BadRequestError("Invalid account");
  let passbook: PassbookDoc;
  if (
    new Date(user.dob) !== new Date(dob) ||
    user.mobile !== mobile ||
    user.email !== email
  ) {
    const sAdminUser = await User.findById(id);
    if (!sAdminUser) throw new NotAuthorizedError();
    if (sAdminUser.isSuperAdmin !== id) throw new NotAuthorizedError();
    if (new Date(user.dob) !== new Date(dob)) {
      if (differenceInCalendarYears(new Date(), new Date(dob)) >= 13)
        user.dob = new Date(dob);
      else throw new BadRequestError("User should atleast be 13 years old");
    }
    if (user.mobile !== mobile) user.mobile = mobile;
    if (user.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new BadRequestError("Email id already in use");
      user.email = email;
    }
  }

  if (user.activity === UserActivity.Inactive)
    throw new BadRequestError("User account inactive");
  if (user.wallet.coins !== coins) {
    passbook = Passbook.build({
      coins: Math.abs(coins - user.wallet.coins),
      transactionEnv: TransactionEnv.AdminAward,
      transactionType:
        coins - user.wallet.coins < 0
          ? TransactionType.Debit
          : TransactionType.Credit,
      ughId: user.ughId,
    });
    user.wallet.coins = coins;
  }
  user.role = role;
  await user.save();
  if (passbook) passbook.save();
  res.send(user);
};
