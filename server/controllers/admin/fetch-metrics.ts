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
  const users = (await User.find()).length;
  const tournaments = (await Tournament.find()).length;
  const sponsors = (await Sponsor.find()).length;
  const streams = (await Stream.find()).length;
  const consoles = (await Console.find()).length;
  const games = (await Game.find()).length;
  const news = (await News.find()).length;
  const gallery = (await Gallery.find()).length;
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
