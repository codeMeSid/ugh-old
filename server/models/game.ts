import mongoose from "mongoose";
import { GameGroups, GameType } from "@monsid/ugh-og"

interface GameAttrs {
  name: string;
  console: string;
  participants: Array<number>;
  winners: Array<number>;
  groups: Array<GameGroups>;
  imageUrl: string;
  thumbnailUrl: string;
  cutoff: number;
  gameType: GameType;
  rules: string;
}

export interface GameDoc extends mongoose.Document {
  name: string;
  console: string;
  participants: Array<number>;
  winners: Array<number>;
  groups: Array<GameGroups>;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  cutoff: number;
  gameType: GameType;
  rules: string;
}

interface GameModel extends mongoose.Model<GameDoc> {
  build(attrs: GameAttrs): GameDoc;
}

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cutoff: {
      type: Number,
      default: 50,
    },
    console: {
      type: String,
      required: true,
    },
    participants: [Number],
    winners: [Number],
    gameType: {
      type: "string",
      enum: Object.values(GameType),
    },
    rules: String,
    groups: [
      {
        name: String,
        participants: Number,
      },
    ],
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
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
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

gameSchema.statics.build = (attrs: GameAttrs) => {
  return new Game(attrs);
};

export const Game = mongoose.model<GameDoc, GameModel>("Games", gameSchema);
