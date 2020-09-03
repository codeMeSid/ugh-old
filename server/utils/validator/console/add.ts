import { body } from "express-validator";

export const consoleAddValidator = [
  body("name").not().isEmpty().withMessage("name is required"),
];
