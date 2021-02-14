import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";
import {
  BadRequestError,
  TransactionTypes,
  UserActivity,
  UserRole,
} from "@monsid/ugh-og";
import { randomBytes } from "crypto";
import { User } from "../../models/user";
import { fire } from "../../utils/firebase";

export const transactionCreateRequestController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const { coins, bank, bankAC, ifsc, name } = req.body;
  console.log(req.body);
  if (!bank || !bankAC || !ifsc || !name)
    throw new BadRequestError("Invalid Bank Details");
  const user = await User.findById(id);
  if (!user) throw new BadRequestError("Request failed");
  if (!user.idProof.panCard || !user.idProof.panUrl)
    throw new BadRequestError("Please update your Pan card details");
  if (!user.idProof.aadharCard || !user.idProof.aadharUrl)
    throw new BadRequestError("Please update your Aadhar card details");
  const userEarnings = user.tournaments
    .filter((t) => t.didWin)
    .reduce((acc, t) => acc + t.coins, 0);
  if (userEarnings < 300)
    throw new BadRequestError(
      "Earn minimum 300 UGH coins in winnings to make withdrawal request"
    );
  const orderId = "ugh" + randomBytes(4).toString("hex").substr(0, 4);
  const transaction = Transaction.build({
    amount: coins,
    status: TransactionTypes.Requested,
    user: id,
    orderId,
    bank,
    bankAC,
    ifsc,
    name,
    userDetail: user,
  });
  await transaction.save();
  const admins = await User.find({
    role: UserRole.Admin,
    activity: UserActivity.Active,
  });
  if (admins)
    admins.forEach((admin) => {
      fire.sendNotification(
        admin.fcmToken,
        "New Withdraw Request",
        `/admin/transactions/${transaction.orderId}`
      );
    });
  res.send(true);
};
