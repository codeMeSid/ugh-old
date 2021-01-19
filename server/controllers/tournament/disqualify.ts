import { BadRequestError, GameType, TournamentStatus } from "@monsid/ugh-og";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bracket, BracketDoc } from "../../models/bracket";
import { Tournament, TournamentDoc } from "../../models/tournament";
import { User } from "../../models/user";
import { DQ } from "../../utils/enum/dq";
import { winnerLogic } from "../../utils/winner-logic";

export const tournamentDisqualifyController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const { userId } = req.body;
  let bracket: BracketDoc;
  let tournament: TournamentDoc;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    tournament = await Tournament.findOne({ regId: tournamentId })
      .populate("game", "gameType", "Games")
      .session(session);
    if (!tournament) throw new BadRequestError("Invalid Request - tournament");
    if (tournament.status === TournamentStatus.Completed)
      throw new BadRequestError("Tournament Completed");
    const user = await User.findById(userId).session(session);
    if (!user) throw new BadRequestError("Invalid Request - user");

    if (tournament.status === TournamentStatus.Upcoming) {
      tournament.players = tournament.players.filter(
        (p) => JSON.stringify(p) !== JSON.stringify(user.id)
      );
    } else if (tournament.status === TournamentStatus.Started) {
      switch (tournament.game.gameType) {
        case GameType.Rank:
          bracket = await Bracket.findOne({
            _id: { $in: tournament.brackets },
            "teamA.user": user,
          }).session(session);
          if (!bracket) throw new BadRequestError("Invalid Request - bracket");
          bracket.winner = DQ.AdminDQ;
          break;
        case GameType.Score:
          const brackets = await Bracket.find({
            _id: { $in: tournament.brackets },
            $or: [{ "teamA.user": user }, { "teamB.user": user }],
          })
            .populate("teamA.user", "ughId", "Users")
            .populate("teamB.user", "ughId", "Users")
            .session(session);
          if (!brackets.length) break;
          bracket = brackets.sort((a, b) => b.round - a.round)[0];
          if (bracket?.teamA?.user?.ughId === user?.ughId)
            bracket.winner = bracket?.teamB?.user?.ughId;
          else bracket.winner = bracket?.teamA?.user?.ughId;
          break;
      }
    }
    tournament.dqPlayers.push(user);
    if (bracket) await bracket.save({ session });
    await tournament.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error.messasge);
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  if (bracket && tournament.game.gameType === GameType.Score)
    winnerLogic(tournament.regId, bracket.regId);
  res.send(true);
};
