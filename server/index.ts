import mongoose from "mongoose";
import {
  successlog,
  errorHandler,
  errorlog,
  timer,
  paymentHandler,
  DatabaseConnectionError,
} from "@monsid/ugh";
import { app, nextApp } from "./app";
import { apiRouter } from "./routes/api-routes";
import { MONGO_URI, RAZORPAY_ID, RAZORPAY_SECRET } from "./utils/env-check";
import { siteRouter } from "./routes/site-routes";
const start = async () => {
  try {
    await nextApp.prepare();
    await mongoose.connect(
      MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: false,
      },
      (err) => {
        if (err) throw new DatabaseConnectionError();
        successlog("Database is connected");
      }
    );
    await timer.connect(MONGO_URI);
    await paymentHandler.init(RAZORPAY_ID, RAZORPAY_SECRET);
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
