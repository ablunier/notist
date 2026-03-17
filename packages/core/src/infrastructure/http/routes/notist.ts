import { Router } from "express";
import type { AppContainer } from "../../container.js";
import { NotistProjectCreator } from "../../../application/NotistProjectCreator.js";

export function createNotistRouter(container: AppContainer): Router {
  const router = Router();
    
  router.put("/projects/add/:projectId", async (req, res) => {
    const { projectId } = req.params;
    
    const notistProjectCreator = new NotistProjectCreator(
      container.resolve("ProjectTodoistGateway"),
      container.resolve("SectionTodoistGateway"),
      container.resolve("LabelTodoistGateway"),
      container.resolve("ProjectNotionGateway"),
      container.resolve("ProjectRepository"),
    );

    res.json(await notistProjectCreator.execute(projectId));
  });

  return router;
}
