import mongoose from "mongoose";
import { SocialTypes } from "@monsid/ugh";

interface StreamAttrs {
  imageUrl: string;
  name: string;
  game: string;
  href: string;
  social: SocialTypes;
}

interface StreamDoc extends mongoose.Document {
  imageUrl: string;
  name: string;
  game: string;
  href: string;
  social: SocialTypes;
  isActive: boolean;
}

interface StreamModel extends mongoose.Model<StreamDoc> {
  build(attrs: StreamAttrs): StreamDoc;
}

const streamSchema = new mongoose.Schema(
  {
    imageUrl: String,
    name: String,
    game: String,
    href: String,
    social: {
      type: String,
      enum: Object.values(SocialTypes),
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
        delete ret._v;
      },
    },
  }
);

streamSchema.statics.build = (attrs: StreamAttrs) => {
  return new Stream(attrs);
};

export const Stream = mongoose.model<StreamDoc, StreamModel>(
  "Streams",
  streamSchema
);
