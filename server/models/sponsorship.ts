import mongoose from "mongoose";
import { SponsorPack } from "@monsid/ugh-og"

interface SponsorshipAttrs {
  name: string;
  color: string;
  packs: Array<SponsorPack>;
  description: string;
}

export interface SponsorshipDoc extends mongoose.Document {
  name: string;
  color: string;
  packs: Array<SponsorPack>;
  description: string;
  isActive: boolean;
}

interface SponsorshipModel extends mongoose.Model<SponsorshipDoc> {
  build(attrs: SponsorshipAttrs): SponsorshipDoc;
}

const sponsorshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    packs: [
      {
        price: Number,
        duration: Number,
      },
    ],
    description: {
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
        delete ret._v;
      },
    },
  }
);

sponsorshipSchema.statics.build = (attrs: SponsorshipAttrs) => {
  return new Sponsorship(attrs);
};

const Sponsorship = mongoose.model<SponsorshipDoc, SponsorshipModel>(
  "Sponsorships",
  sponsorshipSchema
);

export { Sponsorship };
