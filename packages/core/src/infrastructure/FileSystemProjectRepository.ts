import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { Project, ProjectId } from "../domain/Project.js";
import type { ProjectRepository } from "../domain/ProjectRepository.js";

export class FileSystemProjectRepository implements ProjectRepository {
  constructor(private readonly filePath: string) {}

  async findAll(): Promise<Project[]> {
    return this.readProjects();
  }

  async findById(id: ProjectId): Promise<Project | undefined> {
    const projects = await this.readProjects();
    return projects.find((p) => p.id.todoist === id.todoist);
  }

  async create(project: Project): Promise<Project> {
    const projects = await this.readProjects();
    projects.push(project);
    await this.writeProjects(projects);
    return project;
  }

  private async readProjects(): Promise<Project[]> {
    try {
      const content = await readFile(this.filePath, "utf-8");
      return JSON.parse(content) as Project[];
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw err;
    }
  }

  private async writeProjects(projects: Project[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(projects, null, 2), "utf-8");
  }
}
