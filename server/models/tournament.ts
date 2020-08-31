import mongoose from "mongoose";
import { UserPayload, TournamentStatus, GameGroups } from "@monsid/ugh";
import { UserDoc } from "./user";
import { BracketDoc } from "./bracket";
import { GameDoc } from "./game";

interface TournamentAttrs {
  name: string;
  coins: number;
  playerCount: number;
  group?: GameGroups;
  winnerCount: number;
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
  players: Array<UserDoc>;
  game: GameDoc;
  addedBy: UserPayload;
  startDateTime: Date;
  endDateTime: Date;
  brackets: Array<BracketDoc>;
  status: TournamentStatus;
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
