import { GameType } from "@monsid/ugh-og"
import mongoose from "mongoose";
import { UserDoc } from "./user";

interface BracketAttrs {
  teamA: {
    user: UserDoc;
    hasRaisedDispute?: boolean;
    score?: number;
    updateBy?: Date;
    uploadBy?: Date;
    teamMates?: any
  };
  teamB: {
    user: UserDoc;
    hasRaisedDispute?: boolean;
    score?: number;
    updateBy?: Date;
    uploadBy?: Date;
    teamMates?: any
  };
  regId: string;
  round: number;
  gameType: GameType;
  gameName: string;
  tournamentName: string;
  uploadBy?: Date;
}

export interface BracketDoc extends mongoose.Document {
  teamA: {
    user: UserDoc;
    hasRaisedDispute: boolean;
    score: number;
    uploadUrl: string;
    updateBy: Date;
    uploadBy: Date;
    teamMates?: any
  };
  teamB: {
    user: UserDoc;
    hasRaisedDispute: boolean;
    score: number;
    uploadUrl: string;
    updateBy: Date;
    uploadBy: Date;
    teamMates?: any
  };
  gameName: string;
  tournamentName: string;
  winner: string;
  regId: string;
  round: number;
  updateBy: Date;
  uploadBy: Date;
  gameType: GameType;
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
      uploadUrl: String,
      updateBy: mongoose.SchemaTypes.Date,
      uploadBy: mongoose.SchemaTypes.Date,
      teamMates: [{ name: String, email: String }]
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
      uploadUrl: String,
      updateBy: mongoose.SchemaTypes.Date,
      uploadBy: mongoose.SchemaTypes.Date,
      teamMates: [{ name: String, email: String }]
    },
    round: Number,
    regId: String,
    winner: String,
    gameName: String,
    tournamentName: String,
    updateBy: mongoose.SchemaTypes.Date,
    uploadBy: mongoose.SchemaTypes.Date,
    gameType: {
      type: "string",
      enum: Object.values(GameType),
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

BracketSchema.statics.build = (attrs: BracketAttrs) => {
  return new Bracket(attrs);
};

export const Bracket = mongoose.model<BracketDoc, BracketModel>(
  "Brackets",
  BracketSchema
);
