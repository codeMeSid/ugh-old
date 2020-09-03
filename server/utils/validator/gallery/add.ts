import { body } from "express-validator";

export const galleryAddValidator = [
  body("name").not().isEmpty().withMessage("name is required"),
  body("imageUrl").not().isEmpty().withMessage("imageUrl is required"),
];
