import { BadRequestError, TransactionTypes } from "@monsid/ugh-og";
import format from "date-fns/format";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction, TransactionDoc } from "../../models/transaction";
import { User, UserDoc } from "../../models/user";

export const generateReportController = async (req: Request, res: Response) => {
  const sheetTitle = [
    "Created At",
    "Order ID",
    "Razorpay ID",
    "Amount",
    "Status",
  ];
  const userSheetTitle = [
    "Ugh Id",
    "Wallet Balance",
    "Shop Balance",
    "Played",
    "Won",
    "Earnings",
  ];
  const session = await mongoose.startSession();
  session.startTransaction();
  const sheetData: Array<any> = [];
  const userSheetData: any = {};
  try {
    const users: Array<UserDoc> = await User.find().session(session);
    const transactions: Array<TransactionDoc> = await Transaction.find().session(
      session
    );
    users.forEach((user) => {
      if (!userSheetData[`${user.id}`]) {
        const userWins = user.tournaments.filter((t) => t.didWin);
        const earnings = userWins.reduce((acc, t) => acc + t.coins, 0);
        const shopCoins = user.wallet.shopCoins;
        const played = user.tournaments.length;
        const wins = userWins.length;
        const walletBalance = user.wallet.coins;
        userSheetData[`${user.id}`] = {
          ughId: user.ughId,
          walletBalance,
          shopCoins,
          played,
          wins,
          earnings,
          transactions: [],
        };
      }
    });
    transactions.forEach((transaction) => {
      if (
        userSheetData[transaction.user] &&
        transaction.status !== TransactionTypes.Captured &&
        transaction.status !== TransactionTypes.Created
      ) {
        userSheetData[transaction.user].transactions.push([
          format(new Date(transaction.createdAt), "dd/MM/yyyy hh:mm a"),
          transaction.orderId || "NIL",
          transaction.razorpayId || "NIL",
          transaction.amount || "NIL",
          transaction.status,
        ]);
      }
    });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  Object.values(userSheetData).forEach((data: any) => {
    sheetData.push([]);
    sheetData.push(userSheetTitle);
    sheetData.push([]);
    sheetData.push([
      data.ughId,
      data.walletBalance,
      data.shopCoins,
      data.played,
      data.wins,
      data.earnings,
    ]);
    sheetData.push([]);
    sheetData.push(sheetTitle);
    sheetData.push([]);
    sheetData.push(...data.transactions?.reverse());
  });
  res.send(sheetData);
};
