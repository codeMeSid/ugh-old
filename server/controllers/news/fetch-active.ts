import { Request, Response } from "express";
import { News } from "../../models/news";

export const newsFetchActiveController = async (
  req: Request,
  res: Response
) => {
  const news = await News.find({ isActive: true });
  res.send(news);
};
