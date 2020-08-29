import { Request, Response } from "express";
import { User } from "../../models/user";
import { Tournament } from "../../models/tournament";
import { Sponsor } from "../../models/sponsor";
import { Stream } from "../../models/stream";
import { Console } from "../../models/console";
import { Game } from "../../models/game";
import { News } from "../../models/news";
import { Gallery } from "../../models/gallery";

export const adminFetchMetricController = async (
  req: Request,
  res: Response
) => {
  const users = await User.find().countDocuments();
  const tournaments = await Tournament.find().countDocuments();
  const sponsors = await Sponsor.find().countDocuments();
  const streams = await Stream.find().countDocuments();
  const consoles = await Console.find().countDocuments();
  const games = await Game.find().countDocuments();
  const news = await News.find().countDocuments();
  const gallery = await Gallery.find().countDocuments();
  res.send({
    users,
    tournaments,
    sponsors,
    streams,
    consoles,
    games,
    news,
    gallery,
  });
};
