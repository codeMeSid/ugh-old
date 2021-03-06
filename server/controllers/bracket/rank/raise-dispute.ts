import { BadRequestError, timer } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { User } from "../../../models/user";
import mongoose from "mongoose";
import { mailer } from "../../../utils/mailer";
import { MailerTemplate } from "../../../utils/enum/mailer-template";
import { Tournament } from "../../../models/tournament";
import { fire } from "../../../utils/firebase";
import { timerCancelRequest } from "../../../utils/timer-request-cancel";

export const raiseDisputeController = async (req: Request, res: Response) => {
  const { id } = req.currentUser;
  const { bracketId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  let disputeBy: string, disputeOn: string;
  try {
    const bracketA = await Bracket.findOne({ regId: bracketId })
      .populate("teamA.user", "email UghId fcmToken", "Users")
      .session(session);
    if (!bracketA) throw new BadRequestError("Invalid Bracket");
    const tournament = await Tournament.findOne({
      brackets: { $in: [bracketA] },
    }).session(session);
    const user = await User.findById(id).session(session);
    if (!user) throw new BadRequestError("Invalid Request");
    if (bracketA.teamA.score === 0)
      throw new BadRequestError("Player has not updated rank yet");
    if (!bracketA.updateBy)
      throw new BadRequestError("Time's up to raise dispute");
    if (new Date(bracketA.updateBy).valueOf() < Date.now())
      throw new BadRequestError("Time's up to raise dispute");
    if (bracketA.teamB.hasRaisedDispute)
      throw new BadRequestError("Dispute has already been raised");
    bracketA.teamB.hasRaisedDispute = true;
    bracketA.teamB.user = user;
    await bracketA.save({ session });
    await session.commitTransaction();
    disputeBy = user?.ughId;
    disputeOn = bracketA.teamA.user?.ughId;
    fire.sendNotification(
      bracketA.teamA.user.fcmToken,
      `${user?.ughId} raised Ranking dispute.`,
      `/game/${tournament.regId}`
    );
    mailer.send(
      MailerTemplate.Dispute,
      { ughId: bracketA.teamA.user?.ughId, opponentUghId: user?.ughId },
      bracketA.teamA.user.email,
      "UGH Tournament Dispute"
    );
    timerCancelRequest(bracketId);
  } catch (error) {
    console.log({ msg: "rank raise dispute", message: error.message });
    await session.abortTransaction();
    session.endSession();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send({ disputeBy, disputeOn });
};
