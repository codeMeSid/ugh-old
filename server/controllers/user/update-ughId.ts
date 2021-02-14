import { Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError, generateToken, isValidDob } from "@monsid/ugh-og";
import { filter } from "../../utils/profanity-filter";
import { Passbook } from "../../models/passbook";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";
import mongoose from "mongoose";
import { JWT_KEY } from "../../utils/env-check";

export const updateUserUghIdController = async (
  req: Request,
  res: Response
) => {
  const { newUghId } = req.body;
  const { id } = req.currentUser;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let user = await User.findOne({ ughId: newUghId }).session(session);
    if (user) throw new BadRequestError("UghId already taken");
    user = await User.findById(id).session(session);
    if (!user) throw new BadRequestError("Invalid User Operation");
    const walletBalance = user.wallet.coins;
    const earnings = user.tournaments
      .filter((t) => t.didWin && t.coins > 0)
      .reduce((acc, t) => acc + t.coins, 0);
    let fee = 50;
    if (walletBalance >= fee) {
      user.wallet.coins -= fee;
      fee = 0;
    } else if (walletBalance + earnings >= 50) {
      fee -= user.wallet.coins;
      user.wallet.coins = 0;
      user.tournaments = user.tournaments.map((t) => {
        if (t.didWin && t.coins > 0 && fee > 0) {
          if (t.coins >= fee) {
            t.coins -= fee;
            fee = 0;
          } else {
            fee -= t.coins;
            t.coins = 0;
          }
        }
        return t;
      });
    } else throw new BadRequestError("Insufficient Balance");
    let passbooks = await Passbook.find({ ughId: user.ughId });
    user.ughId = newUghId;
    const passbook = Passbook.build({
      coins: 50,
      transactionEnv: TransactionEnv.UghIdUpdate,
      transactionType: TransactionType.Debit,
      ughId: newUghId,
    });
    passbooks = passbooks.map((p) => {
      p.ughId = newUghId;
      return p;
    });
    await Promise.all([
      user.save({ session }),
      passbook.save({ session }),
      passbooks.map((p) => p.save({ session })),
    ]);
    await session.commitTransaction();
    const userJwt = generateToken(
      {
        ughId: user.ughId,
        id: user.id,
        role: user.role,
        name: user.name,
      },
      JWT_KEY!
    );
    req.session = { ...req.session, jwt: userJwt };
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  res.send(true);
};
