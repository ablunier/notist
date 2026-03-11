import express from "express";
import { healthRouter } from "./routes/health.js";
import { todoistRouter } from "./routes/todoist.js";
import helmet from "helmet";

export function createApp(): express.Application {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/todoist", todoistRouter);
  
  return app;
}
