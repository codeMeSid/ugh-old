import { Router } from "express";
import { handle } from "../app";

const router = Router();

router.all("*", (req, res) => handle(req, res));

export { router as siteRouter };
