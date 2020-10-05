import { BadRequestError, NotAuthorizedError } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { mailer } from "../../../utils/mailer";
import { MailerTemplate } from "../../../utils/mailer-template";

export const addScoreProofController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { id } = req.currentUser;
  const { proof } = req.body;
  const bracket = await Bracket.findOne({ regId: bracketId })
    .populate("teamA.user", "ughId email", "Users")
    .populate("teamB.user", "ughId email", "Users");
  if (!bracket) throw new BadRequestError("Invalid bracket");
  const isPlayerA =
    JSON.stringify(bracket.teamA.user.id) === JSON.stringify(id);
  const isPlayerB =
    JSON.stringify(bracket.teamB.user.id) === JSON.stringify(id);
  if (!isPlayerA && !isPlayerB) throw new NotAuthorizedError();
  const {
    teamA: {
      hasRaisedDispute: disputeA,
      score: scoreA,
      uploadUrl: uploadA,
      user: { ughId: uA, email: eA },
    },
    teamB: {
      hasRaisedDispute: disputeB,
      score: scoreB,
      uploadUrl: uploadB,
      user: { ughId: uB, email: eB },
    },
    winner,
  } = bracket;
  if (winner) throw new BadRequestError("Uploading proof failed");
  if (disputeA && scoreB >= 0 && !uploadB) bracket.teamB.uploadUrl = proof;
  else if (disputeB && scoreA >= 0 && !uploadA) bracket.teamA.uploadUrl = proof;
  await bracket.save();
  mailer.send(
    MailerTemplate.Proof,
    disputeA
      ? { ughId: uA, opponentUghId: uB }
      : { ughId: uB, opponentUghId: uA },
    disputeA ? eA : eB,
    "Dispute Proof Added"
  );
  res.send(true);
};
