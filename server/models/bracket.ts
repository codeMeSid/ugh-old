import mongoose from "mongoose";
import { UserDoc } from "./user";

interface BracketAttrs {
  teamA: {
    user: UserDoc;
    hasRaisedDispute?: boolean;
    score?: number;
  };
  teamB: {
    user: UserDoc;
    hasRaisedDispute?: boolean;
    score?: number;
  };
  regId: string;
  round: number;
}

export interface BracketDoc extends mongoose.Document {
  teamA: {
    user: UserDoc;
    hasRaisedDispute: boolean;
    score: number;
    uploadUrl: Array<string>;
  };
  teamB: {
    user: UserDoc;
    hasRaisedDispute: boolean;
    score: number;
    uploadUrl: Array<string>;
  };
  winner: string;
  regId: string;
  round: number;
}

interface BracketModel extends mongoose.Model<BracketDoc> {
  build(attrs: BracketAttrs): BracketDoc;
}

const BracketSchema = new mongoose.Schema(
  {
    teamA: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      hasRaisedDispute: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number,
        default: 0,
      },
      uploadUrl: [String],
    },
    teamB: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      hasRaisedDispute: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number,
        default: 0,
      },
      uploadUrl: [String],
    },
    round: Number,
    regId: String,
    winner: String,
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

BracketSchema.statics.build = (attrs: BracketAttrs) => {
  return new Bracket(attrs);
};

export const Bracket = mongoose.model<BracketDoc, BracketModel>(
  "Brackets",
  BracketSchema
);
