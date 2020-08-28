import mongoose from "mongoose";
import { UserPayload, TournamentStatus } from "@monsid/ugh";
import { UserDoc } from "./user";
import { BracketDoc } from "./bracket";

interface TournamentAttrs {
  name: string;
  coins: number;
  playerCount: number;
  winnerCount: number;
  game: string;
  console: string;
  addedBy: UserPayload;
  startDateTime: Date;
  endDateTime: Date;
}

interface TournamentDoc extends mongoose.Document {
  name: string;
  coins: number;
  playerCount: number;
  winnerCount: number;
  players: Array<UserDoc>;
  game: string;
  console: string;
  addedBy: UserPayload;
  startDateTime: Date;
  endDateTime: Date;
  brackets: Array<BracketDoc>;
  status: TournamentStatus;
}

interface TournamentModel extends mongoose.Model<TournamentDoc> {
  build(attrs: TournamentAttrs): TournamentDoc;
}

const tournamentSchema = new mongoose.Schema({
  name: String,
  coins: Number,
  playerCount: Number,
  winnerCount: Number,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  game: String,
  console: String,
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
      ref: "Brackets",
    },
  ],
  status: {
    type: String,
    enum: Object.values(TournamentStatus),
    default: TournamentStatus.Upcoming,
  },
});

tournamentSchema.statics.build = (attrs: TournamentAttrs) => {
  return new Tournament(attrs);
};

export const Tournament = mongoose.model<TournamentDoc, TournamentModel>(
  "Tournaments",
  tournamentSchema
);
