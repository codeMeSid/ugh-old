import mongoose from "mongoose";
import { TransactionTypes } from "@monsid/ugh-og"
import { UserDoc } from "./user";

interface TransactionAttrs {
  user: string;
  orderId: string;
  amount: number;
  status: TransactionTypes;
  paymentMode?: string;
  phone?: string;
  userDetail?: UserDoc;
}

export interface TransactionDoc extends mongoose.Document {
  user: string;
  orderId: string;
  razorpayId: string;
  amount: number;
  createdAt: Date;
  status: TransactionTypes;
  paymentMode: string;
  phone: string;
  userDetail: UserDoc;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

const transactionSchema = new mongoose.Schema(
  {
    user: String,
    orderId: String,
    razorpayId: String,
    amount: Number,
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
    userDetail: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    status: {
      type: String,
      enum: Object.values(TransactionTypes),
    },
    paymentMode: String,
    phone: String,
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
