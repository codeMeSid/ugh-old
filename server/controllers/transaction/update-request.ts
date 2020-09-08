import { Request, Response } from "express";
import { TransactionTypes, BadRequestError } from "@monsid/ugh";
import { Transaction } from "../../models/transaction";
import mongoose from "mongoose";
import { User } from "../../models/user";

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
    if (accepted) {
      user.set({ "wallet.coins": user.wallet.coins - 240 });
    }
    transaction.set({
      status,
      razorpayId: accepted ? razorpayId : "",
    });
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
