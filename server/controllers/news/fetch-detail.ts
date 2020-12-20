import { BadRequestError } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { News } from "../../models/news";

export const newsFetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { newsId } = req.params;
  const news = await News.findById(newsId);
  if (!news) throw new BadRequestError("News doesnt exists, it's a rumor");
  res.send(news);
};
