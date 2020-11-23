import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { TournamentStatus } from "@monsid/ugh";
import { User } from "../../models/user";

export const tournamentFetchAllMyController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const user = await User.findById(id);
  const tournaments = await Tournament.find({
    $or: [{ "addedBy.id": id }, { players: { $in: [user] } }],
    status: { $nin: [TournamentStatus.Cancelled] },
  }).populate("game", "name console imageUrl thumbnailUrl", "Games");
  res.send(tournaments);
};
