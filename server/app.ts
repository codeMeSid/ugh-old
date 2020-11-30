import "express-async-errors";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NodeEnv } from "@monsid/ugh";

import next from "next";
import { config } from "dotenv";

const app = express();
const isDevMode = process.env.NODE_ENV !== NodeEnv.Production;
const nextApp = next({ dev: isDevMode });
const handle = nextApp.getRequestHandler();

if (isDevMode) config();

// middlewares
app.use(json());
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(
  cookieSession({
    signed: isDevMode,
    keys: ["p"],
  })
);

export { app, nextApp, handle };
