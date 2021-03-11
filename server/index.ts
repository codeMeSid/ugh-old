import mongoose from "mongoose";
import {
  successlog,
  errorHandler,
  errorlog,
  paymentHandler,
  DatabaseConnectionError,
} from "@monsid/ugh-og";
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
import { jobRouter } from "./routes/job-route";

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
    app.use("/job/ugh", jobRouter);
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
