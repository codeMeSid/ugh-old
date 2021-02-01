import { Request, Response } from "express";
import { Category } from "../../models/category";

export const fetchActiveCategoryController = async (
  req: Request,
  res: Response
) => {
  const categorys = await Category.find({ isActive: true }).select("name sub");

  res.send(categorys);
};
