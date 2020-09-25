import { BadRequestError } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../models/bracket";

export const tournamentFetchBracketDetailController = async (
  req: Request,
  res: Response
) => {
  const { bracketId } = req.params;
  const { id } = req.currentUser;
  const bracket = await Bracket.findOne({ regId: bracketId })
    .populate("teamA.user", "ughId uploadUrl", "Users")
    .populate("teamB.user", "ughId uploadUrl", "Users");
  if (!bracket)
    throw new BadRequestError(
      "Bracket seems to be facing some sort of trouble"
    );
  const userA = JSON.stringify(bracket.teamA.user.id);
  const userB = JSON.stringify(bracket.teamB.user.id);
  const user = JSON.stringify(id);
  if (user !== userA && user !== userB)
    throw new BadRequestError("you do not belong here");
  res.send(bracket);
};
