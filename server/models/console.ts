import mongoose from "mongoose";

interface ConsoleAttrs {
  name: string;
}

export interface ConsoleDoc extends mongoose.Document {
  name: string;
  isActive: boolean;
}

interface ConsoleModel extends mongoose.Model<ConsoleDoc> {
  build(attrs: ConsoleAttrs): ConsoleDoc;
}

const ConsoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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

ConsoleSchema.statics.build = (attrs: ConsoleAttrs) => {
  return new Console(attrs);
};

export const Console = mongoose.model<ConsoleDoc, ConsoleModel>(
  "Consoles",
  ConsoleSchema
);
