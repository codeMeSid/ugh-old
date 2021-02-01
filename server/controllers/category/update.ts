import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Category } from "../../models/category";

export const categoryUpdateController = async (req: Request, res: Response) => {
  // TODO: add product updates
  const { name, subCategory } = req.body;
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new BadRequestError("Invalid Category");
  category.name = name;
  category.sub = subCategory;
  await category.save();
  res.send(true);
};
