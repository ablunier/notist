import type { Project } from '../domain/Project.js';
import type { TodoistPaginatedResponse, ProjectTodoistGateway } from '../domain/TodoistGateway.js';

export class TodoistProjectsRetriever {
    constructor(private todoistGateway: ProjectTodoistGateway) {}

    async execute(nextCursor?: string | null): Promise<TodoistPaginatedResponse<Project>> {
        return this.todoistGateway.findAll(nextCursor);
    }
}
