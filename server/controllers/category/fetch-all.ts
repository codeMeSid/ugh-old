import { Request, Response } from "express";
import { Category } from "../../models/category";

export const fetchAllCategoryController = async (
  req: Request,
  res: Response
) => {
  const categorys = await Category.find().sort({ name: -1, isActive: -1 });
  res.send(categorys);
};
