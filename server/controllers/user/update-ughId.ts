import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, isValidDob } from "@monsid/ugh-og";
import { filter } from "../../utils/profanity-filter";
import { Passbook } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";
import mongoose from "mongoose";

export const updateUserUghIdController = async (
  req: Request,
  res: Response
) => {
  const { newUghId } = req.body;
  const { ughId } = req.currentUser;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let user = await User.findOne({ ughId: newUghId }).session(session);
    if (user) throw new BadRequestError("UghId already taken");
    user = await User.findOne({ ughId }).session(session);
    if (!user) throw new BadRequestError("Invalid User Operation");
    const walletBalance = user.wallet.coins;
    if (walletBalance < 50) {
      const earnings = user.tournaments
        .filter((t) => t.didWin && t.coins > 0)
        .reduce((acc, t) => acc + t.coins, 0);
      if (earnings + walletBalance < 50)
        throw new BadRequestError("Insufficient balance.");
      let fee = 50;
      fee -= user.wallet.coins;
      user.wallet.coins = 0;
      user.tournaments = user.tournaments.map((t) => {
        if (t.didWin && t.coins > 0 && fee > 0) {
          if (t.coins < fee) {
            fee -= t.coins;
            t.coins = 0;
          } else {
            t.coins -= 50;
          }
        }
        return t;
      });
    } else {
      user.wallet.coins -= 50;
    }
    const passbooks = await Passbook.find({ ughId: user.ughId });
    user.ughId = newUghId;
    const passbook = Passbook.build({
      coins: 50,
      transactionEnv: TransactionEnv.UghIdUpdate,
      transactionType: TransactionType.Debit,
      ughId: user.ughId,
    });
    await Promise.all([
      user.save({ session }),
      passbook.save({ session }),
      passbooks.map((p) => {
        p.ughId = user.ughId;
        return p.save({ session });
      }),
    ]);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  res.send(true);
};
