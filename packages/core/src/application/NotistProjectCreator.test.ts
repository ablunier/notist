import { describe, it, expect, vi } from 'vitest';
import { NotistProjectCreator } from './NotistProjectCreator.js';
import type { ProjectTodoistGateway, SectionTodoistGateway, LabelTodoistGateway } from '../domain/TodoistGateway.js';
import type { ProjectNotionGateway } from '../domain/NotionGateway.js';
import type { ProjectRepository } from '../domain/ProjectRepository.js';
import type { Project, Section } from '../domain/Project.js';
import type { Label } from '../domain/Task.js';

const makeProject = (todoistId: string): Project => ({
    id: { todoist: todoistId },
    url: { todoist: `https://todoist.com/${todoistId}` },
    name: 'Test Project',
    viewStyle: 'list',
});

const makeSections = (): Section[] => [
    { id: 'section-1', name: 'Section A' },
    { id: 'section-2', name: 'Section B' },
];

const makeLabels = (): Label[] => [
    { id: 'label-1', name: 'Label A', color: 'blue' },
];

const makeGateways = (overrides: {
    todoistProject?: Project | null;
    sections?: Section[];
    labels?: Label[];
    notionProject?: Project;
    savedProject?: Project;
} = {}) => {
    const todoistProject = 'todoistProject' in overrides ? overrides.todoistProject : makeProject('todoist-1');
    const sections = overrides.sections ?? makeSections();
    const labels = overrides.labels ?? makeLabels();
    const notionProject = overrides.notionProject ?? { ...todoistProject, id: { todoist: 'todoist-1', notion: 'notion-1' } };
    const savedProject = overrides.savedProject ?? notionProject;

    const findById = vi.fn().mockResolvedValue(todoistProject ?? undefined);
    const findByProject = vi.fn().mockResolvedValue({ results: sections, next_cursor: null });
    const findAllLabels = vi.fn().mockResolvedValue({ results: labels, next_cursor: null });
    const notionCreate = vi.fn().mockResolvedValue(notionProject);
    const repoCreate = vi.fn().mockResolvedValue(savedProject);

    const projectTodoistGateway: ProjectTodoistGateway = {
        findAll: vi.fn(),
        findById,
        save: vi.fn(),
    };
    const sectionTodoistGateway: SectionTodoistGateway = {
        findByProject,
    };
    const labelTodoistGateway: LabelTodoistGateway = {
        findAll: findAllLabels,
    };
    const notionGateway: ProjectNotionGateway = {
        findById: vi.fn(),
        create: notionCreate,
    };
    const projectRepository: ProjectRepository = {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: repoCreate,
    };

    return {
        projectTodoistGateway,
        sectionTodoistGateway,
        labelTodoistGateway,
        notionGateway,
        projectRepository,
        spies: { findById, findByProject, findAllLabels, notionCreate, repoCreate },
    };
};

type Gateways = Omit<ReturnType<typeof makeGateways>, 'spies'>;

const makeCreator = (gateways: Gateways = makeGateways()) =>
    new NotistProjectCreator(
        gateways.projectTodoistGateway,
        gateways.sectionTodoistGateway,
        gateways.labelTodoistGateway,
        gateways.notionGateway,
        gateways.projectRepository,
    );

describe('NotistProjectCreator', () => {
    it('returns the project saved in the repository', async () => {
        const savedProject: Project = { id: { todoist: 'todoist-1', notion: 'notion-1' }, url: { todoist: 'https://todoist.com/1', notion: 'https://notion.so/1' }, name: 'Saved', viewStyle: 'board' };
        const gateways = makeGateways({ savedProject });
        const creator = makeCreator(gateways);

        const result = await creator.execute('todoist-1');

        expect(result).toEqual(savedProject);
    });

    it('throws when the project is not found in Todoist', async () => {
        const gateways = makeGateways({ todoistProject: null });
        const creator = makeCreator(gateways);

        await expect(creator.execute('missing-id')).rejects.toThrow(
            'Project with ID missing-id not found in Todoist!'
        );
    });

    it('looks up the project by todoist ID', async () => {
        const { spies, ...gateways } = makeGateways();
        const creator = makeCreator(gateways);

        await creator.execute('todoist-1');

        expect(spies.findById).toHaveBeenCalledWith({ todoist: 'todoist-1' });
    });

    it('fetches sections for the given project', async () => {
        const { spies, ...gateways } = makeGateways();
        const creator = makeCreator(gateways);

        await creator.execute('todoist-1');

        expect(spies.findByProject).toHaveBeenCalledWith('todoist-1');
    });

    it('fetches all labels', async () => {
        const { spies, ...gateways } = makeGateways();
        const creator = makeCreator(gateways);

        await creator.execute('todoist-1');

        expect(spies.findAllLabels).toHaveBeenCalledOnce();
    });

    it('creates the Notion page with the project, its sections and labels', async () => {
        const todoistProject = makeProject('todoist-1');
        const sections = makeSections();
        const labels = makeLabels();
        const { spies, ...gateways } = makeGateways({ todoistProject, sections, labels });
        const creator = makeCreator(gateways);

        await creator.execute('todoist-1');

        expect(spies.notionCreate).toHaveBeenCalledWith(todoistProject, sections, labels);
    });

    it('persists the project returned by Notion into the repository', async () => {
        const notionProject: Project = { id: { todoist: 'todoist-1', notion: 'notion-1' }, url: { todoist: 'https://todoist.com/todoist-1' }, name: 'From Notion', viewStyle: 'list' };
        const { spies, ...gateways } = makeGateways({ notionProject });
        const creator = makeCreator(gateways);

        await creator.execute('todoist-1');

        expect(spies.repoCreate).toHaveBeenCalledWith(notionProject);
    });
});
