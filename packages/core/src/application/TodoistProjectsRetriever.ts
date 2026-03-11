import type { ProjectsListResponse, ProjectTodoistGateway } from '../domain/ProjectTodoistGateway.js';

export class TodoistProjectsRetriever {
    constructor(private projectTodoistGateway: ProjectTodoistGateway) {}

    async execute(nextCursor?: string | null): Promise<ProjectsListResponse> {
        return this.projectTodoistGateway.findAll(nextCursor);
    }
}
