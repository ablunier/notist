import type { ProjectId, Project, Section } from "./Project.js";
import type { Label } from "./Task.js";

export type TodoistPaginatedResponse<T> = {
  results: T[],
  next_cursor: string | null
}

export interface ProjectTodoistGateway {
  findAll(nextCursor?: string | null): Promise<TodoistPaginatedResponse<Project>>;
  findById(id: ProjectId): Promise<Project | undefined>;
  save(project: Project): Promise<void>;
}

export interface SectionTodoistGateway {
  findByProject(projectId: string, nextCursor?: string | null): Promise<TodoistPaginatedResponse<Section>>;
}

export interface LabelTodoistGateway {
  findAll(nextCursor?: string | null): Promise<TodoistPaginatedResponse<Label>>;
}
