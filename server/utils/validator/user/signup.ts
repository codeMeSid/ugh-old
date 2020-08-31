import { body } from "express-validator";
import { isValidDob } from "@monsid/ugh";

// ughId, name, email, dob, password

export const signupValidator = [
  body("ughId").not().isEmpty().withMessage("ughId is required"),
  body("name").not().isEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("invalid email"),
  body("password").not().isEmpty().withMessage("password is required"),
  body("dob").custom((val) => {
    if (isValidDob(val)) return true;
  }),
];
