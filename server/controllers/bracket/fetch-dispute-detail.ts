import { BadRequestError } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../models/bracket";
import { Tournament } from "../../models/tournament";

export const bracketFetchDisputeDetail = async (
  req: Request,
  res: Response
) => {
  const { bracketId } = req.params;
  const [regId, teamName] = bracketId.split("-");
  const bracket = await Bracket.findOne({ regId })
    .populate("teamA.user", "ughId", "Users")
    .populate("teamB.user", "ughId", "Users");
  const tournament = await Tournament.findOne({ brackets: { $in: [bracket] } });
  if (!bracket) throw new BadRequestError("Invalid Bracket Dispute");
  const { winner, gameType } = bracket;
  let team;
  if (teamName === "teamA") team = bracket.teamA;
  else team = bracket.teamB;
  res.send({ team, winner, regId, gameType, tournamentId: tournament.regId });
};
