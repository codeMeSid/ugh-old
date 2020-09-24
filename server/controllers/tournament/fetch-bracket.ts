import { Request, Response } from "express";
import { Bracket } from "../../models/bracket";
import { Tournament } from "../../models/tournament";

export const tournamentFetchBracketController = async (
  req: Request,
  res: Response
) => {
  const { tournamentId } = req.params;
  const tournament = await Tournament.findOne({ regId: tournamentId });
  const brackets = await Bracket.find({
    _id: { $in: tournament.brackets },
  }).populate("teamA.user", "ughId", "Users");
  res.send(brackets);
};
