import "express-async-errors";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import next from "next";
import { config } from "dotenv";

const app = express();
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

if (dev) config();

// middlewares
app.use(json());
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(
  cookieSession({
    signed: dev,
    keys: ["p"],
  })
);

export { app, nextApp, handle };
