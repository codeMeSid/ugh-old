import { body } from "express-validator";

export const coinAddValidator = [
  body("cost")
    .isNumeric()
    .custom((val) => {
      if (val <= 0) return false;
      return true;
    })
    .withMessage("cost is required"),
  body("value")
    .isNumeric()
    .custom((val) => {
      if (val <= 0) return false;
      return true;
    })
    .withMessage("value is required"),
];
