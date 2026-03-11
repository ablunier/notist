import { TodoistApi } from "@doist/todoist-api-typescript";
import type { Project, ProjectId } from "../domain/Project.js";
import type { ProjectsListResponse, ProjectTodoistGateway } from "../domain/ProjectTodoistGateway.js";

export class SdkProjectTodoistGateway implements ProjectTodoistGateway {
   private readonly client: TodoistApi;

  constructor() {
    this.client = new TodoistApi(process.env.TODOIST_KEY as string);
  }

  async findAll(nextCursor?: string | null): Promise<ProjectsListResponse> {
    return this.client.getProjects({ cursor: nextCursor }).then((response) => {
      const projects = response.results.map((project) => ({
        id: {
          todoist: project.id,
          notion: "",
        },
        url: {
          todoist: project.url,
          notion: "",
        },
        name: project.name,
        parentId:
          "parentId" in project && project.parentId
            ? { todoist: project.parentId, notion: "" }
            : undefined,
      }));

      return {
        results: projects,
        next_cursor: response.nextCursor
      };
    });
  }

  async findById(id: ProjectId): Promise<Project | undefined> {
    try {
      const project = await this.client.getProject(id.todoist);

      return {
        id: { todoist: project.id, notion: id.notion },
        url: { todoist: project.url, notion: "" },
        name: project.name,
        parentId:
          "parentId" in project && project.parentId
            ? { todoist: project.parentId, notion: "" }
            : undefined,
      };
    } catch {
      return undefined;
    }
  }

  async save(project: Project): Promise<void> {
    await this.client.updateProject(project.id.todoist, {
      name: project.name,
    });
  }
}