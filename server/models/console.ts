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

const ConsoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

ConsoleSchema.statics.build = (attrs: ConsoleAttrs) => {
  return new Console(attrs);
};

export const Console = mongoose.model<ConsoleDoc, ConsoleModel>(
  "Console",
  ConsoleSchema
);
