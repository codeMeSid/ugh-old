import { Request, Response } from "express";
import mongoose from "mongoose";
import { app, nextApp, handle } from "./app";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/error-handler";
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("mongo uri key not found");
    if (!process.env.JWT_KEY) throw new Error("jwt key not found");

    await nextApp.prepare();
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.use("/api", apiRouter);
    app.use(errorHandler);
    app.all("*", (req: Request, res: Response) => handle(req, res));
    console.log("Connected to MongoDb");
    app.listen(process.env.PORT, () => {
      console.log(`SERVICE on port ${process.env.PORT}!!!!!!!!`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
