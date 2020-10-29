import mongoose from "mongoose";

export interface SettingsDoc extends mongoose.Document {
  tournamentFees: number;
  wallpapers: Array<{
    uploadUrl: string;
    href: string;
    title: string;
  }>;
  termsOfService: string;
  privacyPolicy: string;
  aboutUs: string;
  howToPlay: string;
  updatedAt: Date;
}

interface SettingsModel extends mongoose.Model<SettingsDoc> {}

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
    termsOfService: String,
    privacyPolicy: String,
    aboutUs: String,
    howToPlay: String,
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

export const Settings = mongoose.model<SettingsDoc, SettingsModel>(
  "Settings",
  settingsSchema
);
