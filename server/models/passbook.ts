import mongoose from "mongoose";
import { TransactionEnv } from "../utils/enum/transaction-env";
import { TransactionType } from "../utils/enum/transaction-type";

interface PassbookAttrs {
    ughId: string;
    transactionType: TransactionType;
    transactionEnv: TransactionEnv;
    coins: number;
    event?: string;
}

export interface PassbookDoc extends mongoose.Document {
    ughId: string;
    transactionType: TransactionType;
    transactionEnv: TransactionEnv;
    coins: number;
    date: Date;
    event: string;
}

interface PassbookModel extends mongoose.Model<PassbookDoc> {
    build(attrs: PassbookAttrs): PassbookDoc;
}

const passbookSchema = new mongoose.Schema(
    {
        ughId: String,
        event: String,
        transactionType: {
            type: String,
            enum: Object.values(TransactionType)
        },
        transactionEnv: {
            type: String,
            enum: Object.values(TransactionEnv)
        },
        coins: Number,
        date: {
            type: mongoose.Schema.Types.Date,
            default: Date.now()
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

passbookSchema.statics.build = (attrs: PassbookAttrs) => {
    return new Passbook(attrs);
};

export const Passbook = mongoose.model<PassbookDoc, PassbookModel>("Passbooks", passbookSchema);
