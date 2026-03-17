import { TodoistApi } from "@doist/todoist-api-typescript";
import type { Project, ProjectId, Section } from "../domain/Project.js";
import type { TodoistPaginatedResponse, ProjectTodoistGateway, SectionTodoistGateway, LabelTodoistGateway } from "../domain/TodoistGateway.js";
import type { Label, LabelColor } from "../domain/Task.js";

export class SdkProjectTodoistGateway implements ProjectTodoistGateway {
   private readonly client: TodoistApi;

  constructor(apiKey: string) {
    this.client = new TodoistApi(apiKey);
  }

  async findAll(nextCursor?: string | null): Promise<TodoistPaginatedResponse<Project>> {
    return this.client.getProjects({ cursor: nextCursor }).then((response) => {
      const projects = response.results.map((project) => ({
        id: {
          todoist: project.id,
          notion: "",
        },
        url: {
          todoist: project.url,
          notion: "",
        },
        name: project.name,
        viewStyle: project.viewStyle as "list" | "board" | "calendar",
        parentId:
          "parentId" in project && project.parentId
            ? { todoist: project.parentId, notion: "" }
            : undefined,
      }));

      return {
        results: projects,
        next_cursor: response.nextCursor
      };
    });
  }

  async findById(id: ProjectId): Promise<Project | undefined> {
    try {
      const project = await this.client.getProject(id.todoist);

      return {
        id: { todoist: project.id, notion: id.notion },
        url: { todoist: project.url, notion: "" },
        name: project.name,
        viewStyle: project.viewStyle as "list" | "board" | "calendar",
        parentId:
          "parentId" in project && project.parentId
            ? { todoist: project.parentId, notion: "" }
            : undefined,
      };
    } catch {
      return undefined;
    }
  }

  async save(project: Project): Promise<void> {
    await this.client.updateProject(project.id.todoist, {
      name: project.name,
    });
  }
}

export class SdkTodoistSectionGateway implements SectionTodoistGateway {
  private readonly client: TodoistApi;

  constructor(apiKey: string) {
    this.client = new TodoistApi(apiKey);
  }

  async findByProject(projectId: string, nextCursor?: string | null): Promise<TodoistPaginatedResponse<Section>> {
    return this.client.getSections({ projectId: projectId, cursor: nextCursor }).then((response) => {
      const sections = response.results.map((section) => ({
        id: section.id,
        name: section.name,
        section_order: section.sectionOrder,
      }));

      return {
        results: sections,
        next_cursor: response.nextCursor
      };
    });
  }
}

const todoistToNotionColorMap: Record<string, LabelColor> = {
  berry_red: "red",
  red: "red",
  orange: "orange",
  yellow: "yellow",
  olive_green: "green",
  lime_green: "green",
  green: "green",
  mint_green: "green",
  teal: "blue",
  sky_blue: "blue",
  light_blue: "blue",
  blue: "blue",
  grape: "purple",
  violet: "purple",
  lavender: "pink",
  magenta: "pink",
  salmon: "pink",
  charcoal: "gray",
  grey: "gray",
  taupe: "brown",
};

export class SdkTodoistLabelGateway implements LabelTodoistGateway {
  private readonly client: TodoistApi;

  constructor(apiKey: string) {
    this.client = new TodoistApi(apiKey);
  }

  async findAll(nextCursor?: string | null): Promise<TodoistPaginatedResponse<Label>> {
    return this.client.getLabels({ cursor: nextCursor }).then((response) => {
      const labels = response.results.map((label) => ({
        id: label.id,
        name: label.name,
        color: todoistToNotionColorMap[label.color] ?? "default",
      }));

      return {
        results: labels,
        next_cursor: response.nextCursor
      };
    });
  }
}
