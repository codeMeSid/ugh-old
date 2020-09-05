import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../../models/user";
import {
  BadRequestError,
  paymentHandler,
  TransactionTypes,
  infolog,
} from "@monsid/ugh";
import { Transaction } from "../../models/transaction";
import { Coin } from "../../models/coin";
import { info } from "console";

export const transactionVerifyController = async (
  req: Request,
  res: Response
) => {
  const { orderId, paymentId } = req.body;
  const { coinId } = req.params;
  const { id } = req.currentUser;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reciept = await paymentHandler.verifyTransaction(paymentId, orderId);
    infolog(reciept);
    const transaction = await Transaction.findOne({ orderId: reciept }).session(
      session
    );
    info(JSON.stringify(transaction));
    transaction.set({
      razorpayId: paymentId,
      status: TransactionTypes.Captured,
    });
    info(JSON.stringify(transaction));
    const user = await User.findById(id).session(session);
    info(JSON.stringify(user));
    const coins = await Coin.findById(coinId).session(session);
    info(JSON.stringify(coins));
    user.set({ "wallet.coins": user.wallet.coins + coins.value });
    await transaction.save({ session });
    await user.save({ session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  } finally {
    session.endSession();
  }
  res.send(true);
};
