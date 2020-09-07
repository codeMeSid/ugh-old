import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";
import { BadRequestError } from "@monsid/ugh";

export const transactionDetailController = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;
  const transaction = await Transaction.findOne({ orderId });
  if (!transaction) throw new BadRequestError("Transaction does not exists");
  res.send(transaction);
};
