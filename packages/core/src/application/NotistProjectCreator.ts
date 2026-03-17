import type { Project } from "../domain/Project.js";
import type { ProjectNotionGateway } from "../domain/NotionGateway.js";
import type { ProjectRepository } from "../domain/ProjectRepository.js";
import type { LabelTodoistGateway, ProjectTodoistGateway, SectionTodoistGateway } from "../domain/TodoistGateway.js";

export class NotistProjectCreator {
  constructor(
    private projectTodoistGateway: ProjectTodoistGateway,
    private sectionTodoistGateway: SectionTodoistGateway,
    private labelTodoistGateway: LabelTodoistGateway,
    private notionGateway: ProjectNotionGateway,
    private projectRepository: ProjectRepository
  ) {}

  async execute(todoistProjectId: string): Promise<Project> {
    const todoistProject = await this.projectTodoistGateway.findById({ todoist: todoistProjectId });

    if (!todoistProject) {
      throw new Error(`Project with ID ${todoistProjectId} not found in Todoist!`);
    }

    const todoistProjectSections = await this.sectionTodoistGateway.findByProject(todoistProjectId);
    const todoistLabels = await this.labelTodoistGateway.findAll();

    const notionProject = await this.notionGateway.create(
      todoistProject,
      todoistProjectSections.results,
      todoistLabels.results
    );

    const project = await this.projectRepository.create(notionProject);

    // Fire ProjectCreated event (this event will be used to trigger the TodoistTasksToNotionSynchronizer use case)

    return project;
  }
}
