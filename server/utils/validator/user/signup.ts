import { body } from "express-validator";
import { isValidDob } from "@monsid/ugh";

// ughId, name, email, dob, password

export const signupValidator = [
  body("ughId").trim().not().isEmpty().isLength({ max: 10, min: 4 }).withMessage("ughId is required and should have min 4 to max 10 characters."),
  body("name").not().isEmpty().withMessage("name is required "),
  body("email").isEmail().withMessage("invalid email"),
  body("password").not().isEmpty().withMessage("password is required"),
  body("dob").custom((val) => {
    if (isValidDob(val)) return true;
  }),
];
