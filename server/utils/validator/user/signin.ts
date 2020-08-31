import { body } from "express-validator";

export const signinValidator = [
  body("ughId").not().isEmpty().withMessage("ughId is required"),
  body("password").not().isEmpty().withMessage("password is required"),
];
