import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Category } from "../../models/category";

export const addCategoryController = async (req: Request, res: Response) => {
  const { name, subCategory } = req.body;
  if (!subCategory || (subCategory && subCategory.length === 0))
    throw new BadRequestError("Sub-categories should be have 1 item min.");
  let category = await Category.findOne({ name });
  if (category) throw new BadRequestError("Category already exists");
  category = Category.build({
    name,
    sub: subCategory,
  });
  await category.save();
  res.send(true);
};
