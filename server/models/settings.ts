import mongoose from "mongoose";

interface SettingsAttrs {
  tournamentFees: number;
  wallpapers: Array<{
    uploadUrl: string;
    href: string;
    title: string;
  }>;
}

export interface SettingsDoc extends mongoose.Document {
  tournamentFees: number;
  wallpapers: Array<{
    uploadUrl: string;
    href: string;
    title: string;
  }>;
  updatedAt: Date;
}

interface SettingsModel extends mongoose.Model<SettingsDoc> {
  build(attrs: SettingsAttrs): SettingsDoc;
}

const settingsSchema = new mongoose.Schema(
  {
    tournamentFees: {
      type: Number,
      default: 10,
    },
    wallpapers: [
      {
        uploadUrl: String,
        href: String,
        title: String,
      },
    ],
    updatedAt: {
      type: mongoose.Schema.Types.Date,
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

settingsSchema.statics.build = (attrs: SettingsAttrs) => {
  return new Settings(attrs);
};

export const Settings = mongoose.model<SettingsDoc, SettingsModel>(
  "Settings",
  settingsSchema
);
