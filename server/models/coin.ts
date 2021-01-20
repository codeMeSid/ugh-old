import mongoose from "mongoose";

interface CoinAttrs {
  cost: number;
  value: number;
  isShopCoin: boolean;
}

export interface CoinDoc extends mongoose.Document {
  cost: number;
  value: number;
  isActive: boolean;
  isShopCoin: boolean;
}

interface CoinModel extends mongoose.Model<CoinDoc> {
  build(attrs: CoinAttrs): CoinDoc;
}

const CoinSchema = new mongoose.Schema(
  {
    cost: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isShopCoin: { type: Boolean, default: false },
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

CoinSchema.statics.build = (attrs: CoinAttrs) => {
  return new Coin(attrs);
};

export const Coin = mongoose.model<CoinDoc, CoinModel>("Coins", CoinSchema);
