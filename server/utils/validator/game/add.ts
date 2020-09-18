import { body } from "express-validator";

export const gameAddValidator = [
  body("name").not().isEmpty().withMessage("name is required"),
  body("imageUrl").not().isEmpty().withMessage("image is required"),
  body("thumbnailUrl").not().isEmpty().withMessage("thumbnail is required"),
  body("console").not().isEmpty().withMessage("console is required"),
  body("participants")
    .custom((val) => {
      if (val.length >= 1) return true;
      return false;
    })
    .withMessage("Particpants required"),
  body("cutoff")
    .custom((val) => {
      return val >= 20;
    })
    .withMessage("minimum players to start tournament is required"),
];
