import mongoose from "mongoose";

interface GalleryAttrs {
  name: string;
  imageUrl: string;
}

interface GalleryDoc extends mongoose.Document {
  name: string;
  imageUrl: string;
  isActive: boolean;
}

interface GalleryModel extends mongoose.Model<GalleryDoc> {
  build(attrs: GalleryAttrs): GalleryDoc;
}

const gallerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
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
        delete ret.__v;
      },
    },
  }
);

gallerySchema.statics.build = (attrs: GalleryAttrs) => {
  return new Gallery(attrs);
};

const Gallery = mongoose.model<GalleryDoc, GalleryModel>(
  "Gallery",
  gallerySchema
);

export { Gallery };
