import { BadRequestError, UserRole } from "@monsid/ugh-og";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bracket, BracketDoc } from "../../../models/bracket";
import { winnerLogic } from "../../../utils/winner-logic";
import { DQ } from "../../../utils/enum/dq";
import { Tournament } from "../../../models/tournament";

// if dispute is accepted in favour of teamA
// then DQ the teamB from their rank bracket
export const acceptProofController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { id, role } = req.currentUser;
  const { accept, tournamentId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bracketA = await Bracket.findOne({
      regId: bracketId,
      ...(role === UserRole.Admin
        ? {}
        : { "teamB.user": mongoose.Types.ObjectId(id) }),
    })
      .populate("teamA.user", "ughId", "Users")
      .session(session);
    if (!bracketA) throw new BadRequestError("Invalid Request");

    const tournament = await Tournament.findOne({
      regId: tournamentId,
    }).session(session);
    if (!tournament) throw new BadRequestError("Invalid Request");
    const bracketB = await Bracket.findOne({
      _id: { $in: tournament.brackets },
      "teamA.user": bracketA.teamB.user,
    })
      .populate("teamA.user", "ughId", "Users")
      .session(session);
    if (!bracketB) throw new BadRequestError("Invalid Request");
    let brackets: Array<BracketDoc> = [];
    const {
      teamA: {
        score: sA,
        user: { ughId: uA },
        uploadUrl,
      },
      winner: wA,
    } = bracketA;
    const {
      teamA: {
        score: sB,
        user: { ughId: uB },
      },
      teamB: { hasRaisedDispute: dC },
      winner: wB,
    } = bracketB;
    if (wA)
      throw new BadRequestError("Bracket is complete & cannot be challenged.");
    if (accept && !uploadUrl)
      throw new BadRequestError("No proof was uploaded");
    switch (!!accept) {
      case true:
        if (wA !== DQ.AdminDQ && wA !== DQ.DisputeLost) bracketA.winner = uA;
        if (sA !== sB && !dC && wB !== DQ.AdminDQ && wB !== DQ.DisputeLost)
          bracketB.winner = DQ.DisputeLost;
        brackets = await Bracket.find({
          _id: { $in: tournament.brackets },
          "teamA.score": sA,
        });
        brackets = brackets.map((b) => {
          if (
            b.winner !== DQ.AdminDQ &&
            JSON.stringify(b.teamA.user) !==
              JSON.stringify(bracketA.teamA.user.id)
          )
            b.winner = DQ.DisputeLost;
          return b;
        });
        break;
      case false:
        if (wA !== DQ.AdminDQ) bracketA.winner = DQ.DisputeLost;
        if (!dC && wB !== DQ.AdminDQ && wB !== DQ.DisputeLost)
          bracketB.winner = uB;
        break;
    }
    await bracketA.save({ session });
    await bracketB.save({ session });
    brackets.map(async (b) => await b.save({ session }));
    await session.commitTransaction();
  } catch (error) {
    console.log({ msg: "rank accept proof", error: error.message });
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  winnerLogic(tournamentId, null, "dispute accepted");
  res.send(true);
};
