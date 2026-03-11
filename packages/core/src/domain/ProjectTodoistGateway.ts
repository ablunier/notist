import type { ProjectId, Project } from "./Project.js";

export type ProjectsListResponse = {
  results: Project[],
  next_cursor: string | null
}

export interface ProjectTodoistGateway {
  findAll(nextCursor?: string | null): Promise<ProjectsListResponse>;
  findById(id: ProjectId): Promise<Project | undefined>;
  save(project: Project): Promise<void>;
}
