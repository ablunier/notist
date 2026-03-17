import type { ProjectId, Project, Section } from "./Project.js";
import type { Label } from "./Task.js";

export interface ProjectNotionGateway {
  findById(id: ProjectId): Promise<Project | undefined>;
  create(project: Project, sections: Section[], labels: Label[]): Promise<Project>;
}
