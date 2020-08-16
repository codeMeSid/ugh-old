import { Router } from "express";

import { apiHandlers } from "../handlers/api";
import { HttpMethod } from "@monsid/ugh";

const router = Router();

apiHandlers.map(({ url, middlewares, controller, method = HttpMethod.Use }) => {
  return router[method](url, middlewares, controller);
});

export { router as apiRouter };
