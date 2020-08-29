import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  successlog,
  errorHandler,
  errorlog,
  timer,
  paymentHandler,
  DatabaseConnectionError,
} from "@monsid/ugh";
import { app, nextApp, handle } from "./app";
import { apiRouter } from "./routes/api-routes";
import { MONGO_URI, RAZORPAY_ID, RAZORPAY_SECRET } from "./utils/env-check";
const start = async () => {
  try {
    await nextApp.prepare();
    await mongoose.connect(
      MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) throw new DatabaseConnectionError();
        successlog("Database is connected");
      }
    );
    await timer.connect(MONGO_URI);
    await paymentHandler.init(RAZORPAY_ID, RAZORPAY_SECRET);
    app.use("/api/ugh", apiRouter);
    app.use(errorHandler);
    app.all("*", (req: Request, res: Response) => handle(req, res));
    app.listen(process.env.PORT, () => {
      successlog(`SERVICE on port ${process.env.PORT}!!!!!!!!`);
    });
  } catch (error) {
    errorlog(error);
    process.exit(1);
  }
};

start();
