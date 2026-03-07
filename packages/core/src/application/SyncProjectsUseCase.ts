import type { ProjectRepository } from "../domain/ProjectRepository.js";

export interface SyncProjectsResult {
  synced: number;
  errors: string[];
}

export class SyncProjectsUseCase {
  constructor(
    private readonly source: ProjectRepository,
    private readonly destination: ProjectRepository
  ) {}

  async execute(): Promise<SyncProjectsResult> {
    const projects = await this.source.findAll();
    const errors: string[] = [];

    for (const project of projects) {
      try {
        await this.destination.save(project);
      } catch (err) {
        errors.push(
          `Failed to sync project ${project.id}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    return { synced: projects.length - errors.length, errors };
  }
}
