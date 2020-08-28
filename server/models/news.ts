import mongoose from "mongoose";

interface NewsAttrs {
  title: string;
  description: string;
}

interface NewsDoc extends mongoose.Document {
  title: string;
  description: string;
  createdAt: Date;
  isActive: Boolean;
}

interface NewsModel extends mongoose.Model<NewsDoc> {
  build(attrs: NewsAttrs): NewsDoc;
}

const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

newsSchema.statics.build = (attrs: NewsAttrs) => {
  return new News(attrs);
};

export const News = mongoose.model<NewsDoc, NewsModel>("News", newsSchema);
