import mongoose from "mongoose";
import { UserPayload, TournamentStatus, GameGroups } from "@monsid/ugh";
import { UserDoc } from "./user";
import { BracketDoc } from "./bracket";
import { GameDoc } from "./game";

interface TournamentAttrs {
  name: string;
  coins: number;
  winnerCoin: number;
  playerCount: number;
  group?: GameGroups;
  winnerCount: number;
  regId: string;
  game: GameDoc;
  addedBy: UserPayload;
  startDateTime: Date;
  endDateTime: Date;
}

export interface TournamentDoc extends mongoose.Document {
  name: string;
  coins: number;
  playerCount: number;
  group: GameGroups;
  winnerCount: number;
  winnerCoin: number;
  regId: string;
  players: Array<UserDoc>;
  game: GameDoc;
  addedBy: UserPayload;
  startDateTime: Date;
  endDateTime: Date;
  brackets: Array<BracketDoc>;
  status: TournamentStatus;
  winners: Array<string>;
}

interface TournamentModel extends mongoose.Model<TournamentDoc> {
  build(attrs: TournamentAttrs): TournamentDoc;
}

const tournamentSchema = new mongoose.Schema(
  {
    name: String,
    coins: Number,
    playerCount: Number,
    group: {
      name: String,
      participants: Number,
    },
    winnerCount: Number,
    winnerCoin: Number,
    winner: [String],
    players: [
      {
        refs: "Users",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    game: {
      refs: "Games",
      type: mongoose.Schema.Types.ObjectId,
    },
    addedBy: {
      id: String,
      name: String,
      email: String,
      role: String,
    },
    regId: {
      type: String,
      required: true,
    },
    startDateTime: mongoose.Schema.Types.Date,
    endDateTime: mongoose.Schema.Types.Date,
    brackets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refs: "Brackets",
      },
    ],
    status: {
      type: String,
      enum: Object.values(TournamentStatus),
      default: TournamentStatus.Upcoming,
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

tournamentSchema.statics.build = (attrs: TournamentAttrs) => {
  return new Tournament(attrs);
};

export const Tournament = mongoose.model<TournamentDoc, TournamentModel>(
  "Tournaments",
  tournamentSchema
);
