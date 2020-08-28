import { Request, Response } from "express";
import { News } from "../../models/news";

export const newsFetchController = async (req: Request, res: Response) => {
  const news = await News.find();
  res.send(news);
};
