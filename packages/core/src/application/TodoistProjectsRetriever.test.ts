import { describe, it, expect, vi } from 'vitest';
import { TodoistProjectsRetriever } from './TodoistProjectsRetriever.js';
import type { ProjectTodoistGateway, TodoistPaginatedResponse } from '../domain/TodoistGateway.js';
import type { Project } from '../domain/Project.js';

const makeGateway = (response: TodoistPaginatedResponse<Project>): ProjectTodoistGateway => ({
    findAll: vi.fn().mockResolvedValue(response),
    findById: vi.fn(),
    save: vi.fn(),
});

describe('TodoistProjectsRetriever', () => {
    it('returns the projects list from the gateway', async () => {
        const response: TodoistPaginatedResponse<Project> = {
            results: [
                { id: { todoist: '1' }, url: { todoist: 'https://todoist.com/1' }, name: 'Project A', viewStyle: 'list' as const },
                { id: { todoist: '2' }, url: { todoist: 'https://todoist.com/2' }, name: 'Project B', viewStyle: 'list' as const, parentId: { todoist: '1' } },
            ],
            next_cursor: null,
        };
        const gateway = makeGateway(response);
        const retriever = new TodoistProjectsRetriever(gateway);

        const result = await retriever.execute();

        expect(result).toEqual(response);
    });

    it('delegates to the gateway findAll method', async () => {
        const findAll = vi.fn().mockResolvedValue({ results: [], next_cursor: null } satisfies TodoistPaginatedResponse<Project>);
        const gateway: ProjectTodoistGateway = { findAll, findById: vi.fn(), save: vi.fn() };
        const retriever = new TodoistProjectsRetriever(gateway);

        await retriever.execute();

        expect(findAll).toHaveBeenCalledOnce();
    });

    it('propagates a next_cursor when present', async () => {
        const response: TodoistPaginatedResponse<Project> = {
            results: [],
            next_cursor: 'cursor-abc',
        };
        const gateway = makeGateway(response);
        const retriever = new TodoistProjectsRetriever(gateway);

        const result = await retriever.execute();

        expect(result.next_cursor).toBe('cursor-abc');
    });
});
