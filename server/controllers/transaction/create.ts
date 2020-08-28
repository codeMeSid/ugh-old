import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { BadRequestError, paymentHandler, TransactionTypes } from "@monsid/ugh";
import { Transaction } from "../../models/transaction";

export const transactionCreateController = async (
  req: Request,
  res: Response
) => {
  const { amount } = req.body;
  const { id } = req.currentUser;
  let payment;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(id).session(session);
    if (!user) throw new Error("transaction failed");
    if (!user.dob) throw new Error("date of birth not updated");
    payment = await paymentHandler.createOrder(parseInt(amount) * 100);
    const transaction = await Transaction.build({
      amount: parseInt(amount),
      orderId: payment.receipt,
      status: TransactionTypes.Created,
      user: id,
    });
    await transaction.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  } finally {
    session.endSession();
  }
  res.send(payment.id);
};
