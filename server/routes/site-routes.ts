import { Router, Request, Response, NextFunction } from "express";
import { handle } from "../app";
import {
  currentUser,
  UserRole,
  authAdminRoute,
  authRoute,
  nonAuthRoute,
} from "@monsid/ugh";

const router = Router();

router.use("/admin", currentUser, authAdminRoute);
router.use("/settings", currentUser, authRoute);
router.use("/withdraw", currentUser, authRoute);
router.use("/login", currentUser, nonAuthRoute);
router.use("/signup", currentUser, nonAuthRoute);

router.all("*", currentUser, (req, res) => handle(req, res));

export { router as siteRouter };
