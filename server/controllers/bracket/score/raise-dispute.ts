import { BadRequestError, NotAuthorizedError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { mailer } from "../../../utils/mailer";
import { MailerTemplate } from "../../../utils/enum/mailer-template";
import { fire } from "../../../utils/firebase";
import { Tournament } from "../../../models/tournament";

export const raiseScoreDisputeController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const { bracketId } = req.params;
  const bracket = await Bracket.findOne({ regId: bracketId })
    .populate("teamA.user", "ughId email fcmToken", "Users")
    .populate("teamB.user", "ughId email fcmToken", "Users");
  const tournament = await Tournament.findOne({ brackets: { $in: [bracket] } });
  if (!bracket) throw new BadRequestError("Failed to raise dispute");
  if (bracket.winner) throw new BadRequestError("Dispute cannot be raised");
  const isPlayerA =
    JSON.stringify(bracket.teamA.user.id) === JSON.stringify(id);
  const isPlayerB =
    JSON.stringify(bracket.teamB.user.id) === JSON.stringify(id);
  if (!isPlayerA && !isPlayerB) throw new NotAuthorizedError();
  const {
    teamA: {
      hasRaisedDispute: disputeA,
      score: scoreA,
      updateBy: updateA,
      uploadUrl: proofA,
      user: { ughId: uA, email: eA, fcmToken: fA },
    },
    teamB: {
      hasRaisedDispute: disputeB,
      score: scoreB,
      updateBy: updateB,
      uploadUrl: proofB,
      user: { ughId: uB, email: eB, fcmToken: fB },
    },
  } = bracket;

  if (scoreA === -1 || scoreB === -1)
    throw new BadRequestError("Both teams need to upload score");
  if (proofA || proofB)
    throw new BadRequestError("Proof has already been added");
  if (disputeA || disputeB) return res.send(true);

  if (isPlayerA && updateB && Date.now() < new Date(updateB).valueOf()) {
    bracket.teamA.hasRaisedDispute = true;
  }
  if (isPlayerB && updateA && Date.now() < new Date(updateA).valueOf()) {
    bracket.teamB.hasRaisedDispute = true;
    mailer.send(
      MailerTemplate.Dispute,
      { ughId: uA, opponentUghId: uB },
      eA,
      "UGH Tournament Dispute"
    );
  }
  await bracket.save();
  let from: string, to: string;
  if (isPlayerA) {
    mailer.send(
      MailerTemplate.Dispute,
      { ughId: uB, opponentUghId: uA },
      eB,
      "UGH Tournament Dispute"
    );
    from = uA;
    to = fB;
  }
  if (isPlayerB) {
    mailer.send(
      MailerTemplate.Dispute,
      { ughId: uA, opponentUghId: uB },
      eA,
      "UGH Tournament Dispute"
    );
    from = uB;
    to = fA;
  }
  if (from && to)
    fire.sendNotification(
      to,
      `${from} raised Scoring dispute.`,
      `/game/${tournament?.regId}`
    );
  res.send(true);
};
