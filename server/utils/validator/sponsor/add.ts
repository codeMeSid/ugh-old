import { body } from "express-validator";

export const sponsorAddValidator = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("phone").not().isEmpty().withMessage("Phone Number is invalid"),
  body("color").isHexColor().withMessage("In valid duration"),
  body("name").not().isEmpty().withMessage("Invalid Package name"),
];
