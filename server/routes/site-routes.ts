import { Router, Request, Response } from "express";
import { handle } from "../app";
import { currentUser, UserRole } from "@monsid/ugh";

const router = Router();

router.use("/admin", currentUser, (req: Request, res: Response) => {
  if (!req.currentUser || req.currentUser.role !== UserRole.Admin) {
    res.redirect("/signin");
  }
});
router.use("/signin", currentUser, (req: Request, res: Response) => {
  if (req.currentUser) {
    res.redirect("/");
  }
});
router.use("/signup", currentUser, (req: Request, res: Response) => {
    if (req.currentUser) {
      res.redirect("/");
    }
  });

router.all("*", (req, res) => handle(req, res));

export { router as siteRouter };
