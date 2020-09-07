import { Request, Response } from "express";
import { TransactionTypes, BadRequestError } from "@monsid/ugh";
import { Transaction } from "../../models/transaction";

export const transactionUpdateRequestController = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;
  const { accepted } = req.body;
  let status: string;
  if (accepted) status = TransactionTypes.Refunded;
  else status = TransactionTypes.Rejected;
  const transaction = await Transaction.findOne({ orderId });
  if (!transaction) throw new BadRequestError("Invalid transaction");
  transaction.set({ status });
  await transaction.save();
  res.send(true);
};
