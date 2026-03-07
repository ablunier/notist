import type { Project } from "./Project.js";

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | undefined>;
  save(project: Project): Promise<void>;
}
