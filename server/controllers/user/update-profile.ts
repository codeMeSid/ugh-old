import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, UserActivity } from "@monsid/ugh-og"
import { Passbook } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  const { ughId } = req.params;
  const { coins, role } = req.body;
  const user = await User.findOne({ ughId });
  let passbook;
  if (!user) throw new BadRequestError("Invalid account");
  if (user.activity === UserActivity.Inactive)
    throw new BadRequestError("User account inactive");
  if (user.wallet.coins !== coins) {
    passbook = Passbook.build({
      coins: Math.abs(coins - user.wallet.coins),
      transactionEnv: TransactionEnv.AdminAward,
      transactionType: TransactionType.Credit,
      ughId: user.ughId
    })
    user.wallet.coins = coins;
  }
  user.role = role;
  await user.save();
  if (passbook) passbook.save();
  res.send(user);
};
