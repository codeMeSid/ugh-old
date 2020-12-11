import mongoose from "mongoose";
import {
  successlog,
  errorHandler,
  errorlog,
  timer,
  paymentHandler,
  DatabaseConnectionError,
  currentUser,
  authAdminRoute,
} from "@monsid/ugh";
import { app, nextApp } from "./app";
import { apiRouter } from "./routes/api-routes";
import {
  EMAIL,
  MONGO_URI,
  PASSWORD,
  RAZORPAY_ID,
  RAZORPAY_SECRET,
} from "./utils/env-check";
import { siteRouter } from "./routes/site-routes";
import { mailer } from "./utils/mailer";
import { messenger } from "./utils/socket";
import { Request, Response } from "express";

const Agendash = require("agendash");
const start = async () => {
  try {
    await nextApp.prepare();
    await mongoose.connect(
      MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      (err) => {
        if (err) throw new DatabaseConnectionError();
        successlog("Database is connected");
      }
    );
    paymentHandler.init(RAZORPAY_ID, RAZORPAY_SECRET);
    mailer.init(PASSWORD, EMAIL);
    await timer.connect(MONGO_URI);
    app.get("/servive-worker.js", (req: Request, res: Response) => {
      nextApp.serveStatic(req, res, "./.next/server-worker.js")
    })
    const serviceWorkers = [
      {
        filename: 'service-worker.js',
        path: './.next/service-worker.js',
      },
      {
        filename: 'firebase-messaging-sw.js',
        path: './public/firebase-messaging-sw.js',
      },
    ];
    serviceWorkers.forEach(({ filename, path }) => {
      app.get(`/${filename}`, (req: Request, res: Response) => {
        nextApp.serveStatic(req, res, path)
      })
    })
    app.use("/jobs", currentUser, authAdminRoute, Agendash(timer._agenda));
    app.use("/api/ugh", apiRouter);
    app.use(errorHandler);
    app.use(siteRouter);
    const server = app.listen(process.env.PORT, () => {
      successlog(`SERVICE on port ${process.env.PORT}!!!!!!!!`);
    });
    messenger.init(server);
  } catch (error) {
    errorlog(error);
    process.exit(1);
  }
};

start();
