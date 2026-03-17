import express from "express";
import { healthRouter } from "./routes/health.js";
import { createTodoistRouter } from "./routes/todoist.js";
import { createNotistRouter } from "./routes/notist.js";
import helmet from "helmet";
import type { AppContainer } from "../container.js";

export function createApp(container: AppContainer): express.Application {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/notist", createNotistRouter(container));
  app.use("/todoist", createTodoistRouter(container));

  return app;
}
