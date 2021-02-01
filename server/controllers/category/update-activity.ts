import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Category } from "../../models/category";

export const updateActivityCategoryController = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new BadRequestError("Category invalid");
  category.isActive = !category.isActive;
  await category.save();
  res.send(true);
};
