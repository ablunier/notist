import { Router } from "express";
import type { AppContainer } from "../../container.js";
import { TodoistProjectsRetriever } from "../../../application/TodoistProjectsRetriever.js";

export function createTodoistRouter(container: AppContainer): Router {
    const router = Router();

    router.get("/projects", async (req, res) => {
        const todoistProjectsRetriever = new TodoistProjectsRetriever(
            container.resolve("ProjectTodoistGateway")
        );

        res.json(await todoistProjectsRetriever.execute());
    });

    return router;
}
