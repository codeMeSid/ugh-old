import { Request, Response } from "express";
import { News } from "../../models/news";

export const newsAddController = async (req: Request, res: Response) => {
  const { title, description, uploadUrl } = req.body;
  const news = News.build({
    title,
    description,
    uploadUrl,
  });
  await news.save();
  res.send(news);
};
