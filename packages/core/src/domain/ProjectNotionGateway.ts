import type { ProjectId, Project } from "./Project.js";

export interface ProjectNotionGateway {
  findById(id: ProjectId): Promise<Project | undefined>;
  create(project: Project): Promise<void>;
}
