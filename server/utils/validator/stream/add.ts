import { body } from "express-validator";

export const streamAddValidator = [
  body("name").not().isEmpty().withMessage("name is required"),
  body("game").not().isEmpty().withMessage("game is required"),
  body("imageUrl").not().isEmpty().withMessage("imageUrl is required"),
  body("href").not().isEmpty().withMessage("href is required"),
  body("social").not().isEmpty().withMessage("social is required"),
];
