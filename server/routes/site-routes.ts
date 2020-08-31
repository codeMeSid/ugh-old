import { Router, Request, Response, NextFunction } from "express";
import { handle } from "../app";
import { currentUser, UserRole } from "@monsid/ugh";

const router = Router();

router.use(
  "/admin",
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser && req.currentUser.role === UserRole.Admin) next();
    else res.redirect("/signin");
  }
);
router.use(
  "/signin",
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser) res.redirect("/");
    else next();
  }
);
router.use(
  "/signup",
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser) res.redirect("/");
    else next();
  }
);

router.all("*", currentUser, (req, res) => handle(req, res));

export { router as siteRouter };
