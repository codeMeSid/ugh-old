import { Request, Response } from "express";
import { winnerLogic } from "../../utils/winner-logic";

export const TournamentEvaluateController = async (
  req: Request,
  res: Response
) => {
  const { regId } = req.params;
  winnerLogic(regId, null, "evaluate");
  res.send(true);
};
