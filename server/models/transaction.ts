import mongoose from "mongoose";
import { TransactionTypes } from "@monsid/ugh";

interface TransactionAttrs {
  user: string;
  orderId: string;
  amount: number;
  status: TransactionTypes;
}

interface TransactionDoc extends mongoose.Document {
  user: string;
  orderId: string;
  razorpayId: string;
  amount: number;
  createdAt: Date;
  status: TransactionTypes;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

const transactionSchema = new mongoose.Schema(
  {
    user: String,
    orderId: String,
    razorpayId: String,
    amount: { type: Number, min: 1000 },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
    status: {
      type: String,
      enum: Object.values(TransactionTypes),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret._v;
      },
    },
  }
);

transactionSchema.statics.build = (attrs: TransactionAttrs) =>
  new Transaction(attrs);

export const Transaction = mongoose.model<TransactionDoc, TransactionModel>(
  "Transactions",
  transactionSchema
);
