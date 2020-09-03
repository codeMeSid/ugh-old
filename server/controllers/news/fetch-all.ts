import { Request, Response } from "express";
import { News } from "../../models/news";

export const newsFetchController = async (req: Request, res: Response) => {
  const news = await News.find().sort({ isActive: -1 });
  res.send(news);
};
