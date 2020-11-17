import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";
import { BadRequestError, TransactionTypes } from "@monsid/ugh";
import { randomBytes } from "crypto";
import { User } from "../../models/user";

export const transactionCreateRequestController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const { coins, paymentMode, phone } = req.body;
  if (!phone) throw new BadRequestError("mobile no./UPI id required");
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
    paymentMode,
    phone,
    userDetail: user,
  });
  await transaction.save();
  res.send(true);
};
