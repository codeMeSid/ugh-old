import { Request, Response } from "express";
import { News } from "../../models/news";

export const newsAddController = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const news = News.build({
    title,
    description,
  });
  await news.save();
  res.send(news);
};
