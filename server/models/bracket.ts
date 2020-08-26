import mongoose from "mongoose";
import { UserDoc } from "./user";

interface BracketAttrs {
  teamA: {
    users: Array<UserDoc>;
    hasRaisedDispute: boolean;
    score: number;
  };
  teamB: {
    users: Array<UserDoc>;
    hasRaisedDispute: boolean;
    score: number;
  };
}

export interface BracketDoc extends mongoose.Document {
  teamA: {
    users: Array<UserDoc>;
    hasRaisedDispute: boolean;
    score: number;
    uploadUrl: Array<string>;
  };
  teamB: {
    users: Array<UserDoc>;
    hasRaisedDispute: boolean;
    score: number;
    uploadUrl: Array<string>;
  };
  winner: string;
}

interface BracketModel extends mongoose.Model<BracketDoc> {
  build(attrs: BracketAttrs): BracketDoc;
}

const BracketSchema = new mongoose.Schema({
  teamA: {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
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
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
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
  winner: String,
});

BracketSchema.statics.build = (attrs: BracketAttrs) => {
  return new Bracket(attrs);
};

export const Bracket = mongoose.model<BracketDoc, BracketModel>(
  "Brackets",
  BracketSchema
);
