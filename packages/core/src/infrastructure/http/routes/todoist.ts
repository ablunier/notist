import { Router } from "express";
import { TodoistProjectsRetriever } from "../../../application/TodoistProjectsRetriever.js";
import { SdkProjectTodoistGateway } from "../../SdkProjectTodoistGateway.js";

export const todoistRouter = Router();

todoistRouter.get("/projects", async (_req, res) => {
    const todoistProjectRetriever = new TodoistProjectsRetriever(
        new SdkProjectTodoistGateway()
    );

    res.json(await todoistProjectRetriever.execute());
});
