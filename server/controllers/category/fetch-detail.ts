import { BadRequestError } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Category } from "../../models/category";

export const categoryfetchDetailController = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new BadRequestError("Invalid Category");
  res.send(category);
};
