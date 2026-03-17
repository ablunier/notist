import type { ProjectId, Project } from "./Project.js";

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: ProjectId): Promise<Project | undefined>;
  create(project: Project): Promise<Project>;
}
