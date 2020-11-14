import { body } from "express-validator";

export const sponsorUpdateValidator = [
  body("website").isURL().withMessage("Invalid website url"),
  body("name").not().isEmpty().withMessage("name is required"),
];
// { name: '', website: '', imageUrl: '', links: [] }
