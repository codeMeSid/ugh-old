import { Router } from "express";
import { handle } from "../app";
import {
  currentUser,
  authAdminRoute,
  authRoute,
  nonAuthRoute,
} from "@monsid/ugh";

const router = Router();

router.use("/login", currentUser, nonAuthRoute);
router.use("/signup", currentUser, nonAuthRoute);
router.use("/account", currentUser, nonAuthRoute);
router.use("/admin", currentUser, authAdminRoute);
router.use("/settings", currentUser, authRoute);
router.use("/withdraw", currentUser, authRoute);
router.use("/profile", currentUser, authRoute);
router.use("/signout", currentUser, authRoute);
router.use("/tournament/game", currentUser, authRoute);

router.all("*", currentUser, (req, res) => handle(req, res));

export { router as siteRouter };
