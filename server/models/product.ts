import mongoose from "mongoose";
import { CategoryDoc } from "./category";

interface ProductAttrs {
  name: string;
  imageUrls: Array<string>;
  coins: number;
  description: string;
  isInStock: boolean;
  isNewlyStocked: boolean;
  isInSale: boolean;
  saleValue: number;
  releaseDate: Date;
  tags: Array<string>;
  category: string;
  sub: string;
  addedBy: string;
}

export interface ProductDoc extends mongoose.Document {
  name: string;
  imageUrls: Array<string>;
  coins: number;
  description: string;
  isInStock: boolean;
  isNewlyStocked: boolean;
  isInSale: boolean;
  saleValue: number;
  releaseDate: Date;
  tags: Array<string>;
  category: string;
  sub: string;
  isActive: boolean;
  addedBy: string;
  createdAt: Date;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    imageUrls: [String],
    coins: Number,
    description: String,
    isInStock: Boolean,
    isNewlyStocked: Boolean,
    isInSale: Boolean,
    saleValue: Number,
    releaseDate: mongoose.Schema.Types.Date,
    tags: [String],
    category: String,
    sub: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: String,
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now(),
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

ProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

export const Product = mongoose.model<ProductDoc, ProductModel>(
  "Products",
  ProductSchema
);
