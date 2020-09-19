import { body } from "express-validator";

export const sponsorshipAddValidator = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("color").not().isEmpty().withMessage("Proper color is required"),
  body("packs")
    .custom((val) => {
      return val.length >= 1;
    })
    .withMessage("packs is required"),
];
