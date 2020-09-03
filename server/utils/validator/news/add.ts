import { body } from "express-validator";

export const newsAddValidator = [
  body("title").not().isEmpty().withMessage("title is required"),
  body("description").not().isEmpty().withMessage("description is required"),
];
