import mongoose from "mongoose";

interface CategoryAttrs {
  name: string;
  sub: Array<string>;
}

export interface CategoryDoc extends mongoose.Document {
  name: string;
  sub: Array<string>;
  isActive: boolean;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
}

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    sub: [String],
    isActive: {
      type: Boolean,
      default: true,
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

CategorySchema.statics.build = (attrs: CategoryAttrs) => {
  return new Category(attrs);
};

export const Category = mongoose.model<CategoryDoc, CategoryModel>(
  "Categorys",
  CategorySchema
);
