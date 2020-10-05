import { BadRequestError } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import mongoose from "mongoose";
import { mailer } from "../../../utils/mailer";
import { MailerTemplate } from "../../../utils/mailer-template";

export const addProofController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { proof } = req.body;
  const { id } = req.currentUser;
  const bracket = await Bracket.findOne({
    regId: bracketId,
    "teamA.user": mongoose.Types.ObjectId(id),
  })
    .populate("teamA.user", "ughId email", "Users")
    .populate("teamB.user", "ughId email", "Users");
  if (!bracket) throw new BadRequestError("Invalid Request");
  if (!bracket.teamB.hasRaisedDispute)
    throw new BadRequestError("No Dispute was raised");
  if (bracket.teamA.uploadUrl)
    throw new BadRequestError("Proof already uploaded");
  bracket.teamA.uploadUrl = proof;
  await bracket.save();
  const {
    teamA: {
      user: { ughId, email },
    },
    teamB: {
      user: { ughId: opponentUghId },
    },
  } = bracket;
  mailer.send(
    MailerTemplate.Proof,
    { ughId, opponentUghId },
    email,
    "Dispute Proof Added"
  );
  res.send(true);
};
