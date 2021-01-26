import mongoose from "mongoose";
import { UserCart } from "../utils/interface/user/cart";

interface OrderAttrs {
  products: Array<UserCart>;
  couponUsed?: string;
  totalValue: number;
  deliveryValue: number;
  totalQty: number;
  userDetails: {
    ughId: string;
    mobile: string;
    email: string;
    name: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    landmark: string;
    state: string;
    locality: string;
    pincode: string;
  };
  billingAddress: {
    address1: string;
    address2?: string;
    landmark: string;
    state: string;
    locality: string;
    pincode: string;
  };
}

export interface OrderDoc extends mongoose.Document {
  regId: string;
  products: Array<UserCart>;
  couponUsed: string;
  totalValue: number;
  deliveryValue: number;
  totalQty: number;
  createdAt: Date;
  deliveredAt: Date;
  userDetails: {
    ughId: string;
    mobile: string;
    email: string;
    name: string;
  };
  shippingAddress: {
    address1: string;
    address2: string;
    landmark: string;
    state: string;
    locality: string;
    pincode: string;
  };
  billingAddress: {
    address1: string;
    address2: string;
    landmark: string;
    state: string;
    locality: string;
    pincode: string;
  };
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    regId: String,
    products: [
      {
        imageUrl: String,
        qty: Number,
        value: Number,
        name: String,
        size: String,
      },
    ],
    couponUsed: String,
    totalValue: Number,
    deliveryValue: Number,
    totalQty: Number,
    createdAt: mongoose.Schema.Types.Date,
    deliveredAt: mongoose.Schema.Types.Date,
    userDetails: {
      ughId: String,
      mobile: String,
      email: String,
      name: String,
    },
    shippingAddress: {
      address1: String,
      address2: String,
      landmark: String,
      state: String,
      locality: String,
      pincode: String,
    },
    billingAddress: {
      address1: String,
      address2: String,
      landmark: String,
      state: String,
      locality: String,
      pincode: String,
    },
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

orderSchema.statics.build = (attrs: OrderAttrs): OrderDoc => {
  return new Order(attrs);
};

export const Order = mongoose.model<OrderDoc, OrderModel>(
  "Orders",
  orderSchema
);
