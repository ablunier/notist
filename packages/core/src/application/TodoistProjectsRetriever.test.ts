import { describe, it, expect, vi } from 'vitest';
import { TodoistProjectsRetriever } from './TodoistProjectsRetriever.js';
import type { ProjectTodoistGateway, ProjectsListResponse } from '../domain/ProjectTodoistGateway.js';

const makeGateway = (response: ProjectsListResponse): ProjectTodoistGateway => ({
    findAll: vi.fn().mockResolvedValue(response),
    findById: vi.fn(),
    save: vi.fn(),
});

describe('TodoistProjectsRetriever', () => {
    it('returns the projects list from the gateway', async () => {
        const response: ProjectsListResponse = {
            results: [
                { id: { todoist: '1' }, url: { todoist: 'https://todoist.com/1' }, name: 'Project A' },
                { id: { todoist: '2' }, url: { todoist: 'https://todoist.com/2' }, name: 'Project B', parentId: { todoist: '1' } },
            ],
            next_cursor: null,
        };
        const gateway = makeGateway(response);
        const retriever = new TodoistProjectsRetriever(gateway);

        const result = await retriever.execute();

        expect(result).toEqual(response);
    });

    it('delegates to the gateway findAll method', async () => {
        const response: ProjectsListResponse = { results: [], next_cursor: null };
        const gateway = makeGateway(response);
        const retriever = new TodoistProjectsRetriever(gateway);

        await retriever.execute();

        expect(gateway.findAll()).toHaveBeenCalledOnce();
    });

    it('propagates a next_cursor when present', async () => {
        const response: ProjectsListResponse = {
            results: [],
            next_cursor: 'cursor-abc',
        };
        const gateway = makeGateway(response);
        const retriever = new TodoistProjectsRetriever(gateway);

        const result = await retriever.execute();

        expect(result.next_cursor).toBe('cursor-abc');
    });
});
