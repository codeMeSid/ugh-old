import { body } from "express-validator";

export const tournamentAddValidator = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("coins")
    .not()
    .isNumeric()
    .custom((val) => {
      return val > 0;
    })
    .withMessage("Entry coins required"),
  body("winnerCount")
    .not()
    .isNumeric()
    .custom((val) => {
      return val >= 1;
    })
    .withMessage("Winners count is required"),
  body("startDateTime")
    .not()
    .isDate()
    .custom((val) => {
      const date = new Date(val);
      const msIn1Hr = 1000 * 60 * 60;
      return date.valueOf() - Date.now().valueOf() >= msIn1Hr;
    })
    .withMessage("Match should be scheduled atleast 1 hour ahead"),
  body("endDateTime")
    .not()
    .isDate()
    .custom((val) => {
      const date = new Date(val);
      return date.valueOf() - Date.now().valueOf() > 0;
    })
    .withMessage("Match cannot end before starting"),
  body("game").not().isEmpty().withMessage("valid game is required"),
  body("playerCount")
    .not()
    .isNumeric()
    .custom((val) => {
      return val >= 1;
    })
    .withMessage("Player count is required"),
];