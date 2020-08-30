import mongoose from "mongoose";
import { SponsorPack, SponsorContact, SponsorLink } from "@monsid/ugh";

interface SponsorAttrs {
  contact: SponsorContact;
  packName: string;
  pack: SponsorPack;
  message?: string;
}

export interface SponsorDoc extends mongoose.Document {
  name: string;
  contact: SponsorContact;
  packName: string;
  pack: SponsorPack;
  sponsorId: string;
  message: string;
  imageUrl: string;
  website: string;
  links: Array<SponsorLink>;
  isActive: boolean;
  isProccessed: boolean;
}

interface SponsorModel extends mongoose.Model<SponsorDoc> {
  build(attrs: SponsorAttrs): SponsorDoc;
}

const sponsorSchema = new mongoose.Schema(
  {
    name: String,
    contact: {
      phone: String,
      email: String,
    },
    packName: {
      type: String,
      required: true,
    },
    pack: {
      duration: Number,
      price: Number,
    },
    sponsorId: String,
    message: String,
    imageUrl: String,
    website: String,
    links: [
      {
        name: String,
        href: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    isProccessed: {
      type: Boolean,
      default: false,
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

sponsorSchema.statics.build = (attrs: SponsorAttrs) => {
  return new Sponsor(attrs);
};

const Sponsor = mongoose.model<SponsorDoc, SponsorModel>(
  "Sponsors",
  sponsorSchema
);

export { Sponsor };
