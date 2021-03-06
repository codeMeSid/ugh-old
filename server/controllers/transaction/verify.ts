import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../../models/user";
import {
  BadRequestError,
  paymentHandler,
  TransactionTypes,
  UserActivity,
} from "@monsid/ugh-og";
import { Transaction } from "../../models/transaction";
import { Coin } from "../../models/coin";
import { Passbook } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";

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
    const transaction = await Transaction.findOne({ orderId: reciept }).session(
      session
    );
    transaction.set({
      razorpayId: paymentId,
      status: TransactionTypes.Captured,
    });
    const user = await User.findById(id).session(session);
    const coins = await Coin.findById(coinId).session(session);
    if (!user || (user && user?.activity !== UserActivity.Active))
      throw new BadRequestError("Invalid User Operation");
    if (!coins) throw new BadRequestError("Invalid Transaction Opration");
    if (coins.isShopCoin) {
      user.wallet.shopCoins = user.wallet.shopCoins
        ? user.wallet.shopCoins + coins.value
        : coins.value;
    } else {
      user.wallet.coins += coins.value;
    }
    const passbook = Passbook.build({
      coins: coins.value,
      transactionEnv: TransactionEnv.Purchase,
      transactionType: TransactionType.Credit,
      ughId: user.ughId,
    });
    await passbook.save({ session });
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
