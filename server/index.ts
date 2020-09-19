import mongoose from "mongoose";
import {
  successlog,
  errorHandler,
  errorlog,
  timer,
  paymentHandler,
  DatabaseConnectionError,
  currentUser,
  requireAdminAuth,
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
    await timer.connect(MONGO_URI);
    await paymentHandler.init(RAZORPAY_ID, RAZORPAY_SECRET);
    mailer.init(PASSWORD, EMAIL);
    app.use("/jobs", currentUser, authAdminRoute, Agendash(timer._agenda));
    app.use("/api/ugh", apiRouter);
    app.use(errorHandler);
    app.use(siteRouter);
    app.listen(process.env.PORT, () => {
      successlog(`SERVICE on port ${process.env.PORT}!!!!!!!!`);
    });
  } catch (error) {
    errorlog(error);
    process.exit(1);
  }
};

start();
