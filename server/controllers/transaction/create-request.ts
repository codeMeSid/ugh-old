import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";
import { TransactionTypes } from "@monsid/ugh";
import { randomBytes } from "crypto";

export const transactionCreateRequestController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const { coins } = req.body;
  const orderId = "ugh" + randomBytes(4).toString("hex").substr(0, 4);
  const transaction = Transaction.build({
    amount: coins,
    status: TransactionTypes.Requested,
    user: id,
    orderId,
  });
  await transaction.save();
  res.send(true);
};
