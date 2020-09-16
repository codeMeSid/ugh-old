import mongoose from "mongoose";

interface NewsAttrs {
  title: string;
  description: string;
  uploadUrl: string;
}

export interface NewsDoc extends mongoose.Document {
  title: string;
  description: string;
  uploadUrl: string;
  createdAt: Date;
  isActive: boolean;
}

interface NewsModel extends mongoose.Model<NewsDoc> {
  build(attrs: NewsAttrs): NewsDoc;
}

const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    uploadUrl: String,
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now(),
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

newsSchema.statics.build = (attrs: NewsAttrs) => {
  return new News(attrs);
};

export const News = mongoose.model<NewsDoc, NewsModel>("News", newsSchema);
