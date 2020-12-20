import { Request, Response } from "express";
import { News } from "../../models/news";
import { BadRequestError } from "@monsid/ugh-og"

export const newsUpdateActiveController = async (
  req: Request,
  res: Response
) => {
  const { newsId } = req.params;
  const news = await News.findById(newsId);
  if (!news) throw new BadRequestError("News doesnt exists");
  news.set({ isActive: !news.isActive });
  await news.save();
  res.send(news);
};
