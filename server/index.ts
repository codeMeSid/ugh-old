import { Request, Response } from "express";
import { startDb, successlog, errorHandler, errorlog } from "@monsid/ugh";
import { app, nextApp, handle } from "./app";
import { apiRouter } from "./routes/api-routes";
import { MONGO_URI } from "./utils/env-check";
const start = async () => {
  try {
    await nextApp.prepare();
    await startDb(MONGO_URI!);
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
