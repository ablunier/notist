import { TodoistApi } from "@doist/todoist-api-typescript";
import type { Project } from "../domain/Project.js";
import type { ProjectRepository } from "../domain/ProjectRepository.js";

export class TodoistProjectRepository implements ProjectRepository {
  private readonly client: TodoistApi;

  constructor(apiToken: string) {
    this.client = new TodoistApi(apiToken);
  }

  async findAll(): Promise<Project[]> {
    const response = await this.client.getProjects();
    return response.results.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      parentId: "parentId" in p ? (p.parentId ?? undefined) : undefined,
      isShared: p.isShared,
      isFavorite: p.isFavorite,
    }));
  }

  async findById(id: string): Promise<Project | undefined> {
    const projects = await this.findAll();
    return projects.find((p) => p.id === id);
  }

  async save(_project: Project): Promise<void> {
    throw new Error("TodoistProjectRepository.save: not implemented");
  }
}
