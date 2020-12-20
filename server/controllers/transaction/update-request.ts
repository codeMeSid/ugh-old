import { Request, Response } from "express";
import { TransactionTypes, BadRequestError } from "@monsid/ugh-og"
import { Transaction } from "../../models/transaction";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { Passbook, PassbookDoc } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";

export const transactionUpdateRequestController = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;
  const { accepted, razorpayId } = req.body;
  let status: string;
  if (accepted) status = TransactionTypes.Refunded;
  else status = TransactionTypes.Rejected;
  if (accepted && !razorpayId)
    throw new BadRequestError("transaction id is required to accept refund");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transaction = await Transaction.findOne({ orderId }).session(session);
    if (!transaction) throw new BadRequestError("Invalid transaction");
    const user = await User.findById(transaction.user).session(session);
    let passbook: PassbookDoc;
    if (accepted) {
      if (user?.tournaments
        .filter((t) => t.didWin)
        .reduce((acc, t) => acc + t.coins, 0) - transaction.amount < 0)
        throw new BadRequestError("Insufficient Balance to process");
      let amount = transaction.amount;
      user.tournaments = user.tournaments.map(t => {
        if (!t.didWin) return t;
        if (amount > 0) {
          if (amount > t.coins) {
            amount -= t.coins
            t.coins = 0;
          } else {
            t.coins -= amount;
            amount = 0
          }
        }
        return t;
      })
      passbook = Passbook.build({
        coins: transaction.amount,
        transactionEnv: TransactionEnv.Refund,
        transactionType: TransactionType.Debit,
        ughId: user.ughId
      });
    }
    transaction.set({
      status,
      razorpayId: accepted ? razorpayId : "",
    });
    if (passbook) await passbook.save({ session });
    await transaction.save({ session });
    await user.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send(true);
};
