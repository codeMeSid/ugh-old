import { body } from "express-validator";

export const sponsorAddValidator = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("phone").not().isEmpty().withMessage("Phone Number is invalid"),
  body("duration").not().isNumeric().withMessage("In valid duration"),
  body("price").not().isNumeric().withMessage("In valid duration"),
  body("color").isHexColor().withMessage("In valid duration"),
  body("name").not().isEmpty().withMessage("Invalid Package name"),
];
