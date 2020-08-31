import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";

export const transactionFetchAllController = async (
  req: Request,
  res: Response
) => {
  const transactions = await Transaction.find();
  res.send(transactions);
};
