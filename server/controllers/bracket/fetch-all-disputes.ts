import { Response, Request } from "express";
import { Bracket } from "../../models/bracket";

interface Dispute {
  bracketId: string;
  id: string;
  ughId: {
    on: string;
    by: string;
  };
  gameType: string;
  proof: string;
  wasResolved: string;
  gameName: string;
  tournamentName: string;
}

export const bracketFetchDisputes = async (req: Request, res: Response) => {
  const brackets = await Bracket.find({
    $or: [
      { "teamA.hasRaisedDispute": true },
      { "teamB.hasRaisedDispute": true },
    ],
  })
    .sort({ winner: 1 })
    .populate("teamA.user", "ughId", "Users")
    .populate("teamB.user", "ughId", "Users");

  const disputes: Array<Dispute> = [];

  brackets.forEach((bracket) => {
    const {
      teamA: {
        hasRaisedDispute: disputeA,
        uploadUrl: uploadA,
        user: { ughId: uA },
      },
      teamB: {
        hasRaisedDispute: disputeB,
        uploadUrl: uploadB,
        user: { ughId: uB },
      },
      winner,
      regId,
      gameType,
    } = bracket;
    if (disputeA)
      disputes.push({
        bracketId: `${regId}-teamB`,
        id: bracket.id,
        gameType,
        proof: uploadB,
        wasResolved: winner,
        ughId: { by: uA, on: uB },
        gameName: bracket.gameName,
        tournamentName: bracket.tournamentName,
      });
    if (disputeB)
      disputes.push({
        bracketId: `${regId}-teamA`,
        gameType,
        id: bracket.id,
        proof: uploadA,
        wasResolved: winner,
        ughId: { by: uB, on: uA },
        gameName: bracket.gameName,
        tournamentName: bracket.tournamentName,
      });
  });

  res.send(disputes);
};
