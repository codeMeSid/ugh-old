import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";

export const transactionFetchController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const transactions = await Transaction.find({ user: id })
    .select("createdAt amount orderId status")
    .sort({ createdAt: -1 });
  res.send(transactions);
};
