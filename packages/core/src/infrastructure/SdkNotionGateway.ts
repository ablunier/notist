import { Client, type CreateDatabaseResponse, type CreatePageResponse } from "@notionhq/client";
import type { Project, ProjectId, Section } from "../domain/Project.js";
import type { ProjectNotionGateway } from "../domain/NotionGateway.js";
import { TaskPriorities, type Label } from "../domain/Task.js";

export class SdkProjectNotionGateway implements ProjectNotionGateway {
  private readonly client: Client;
  private readonly pageParentId: string;

  constructor(apiKey: string, pageParentId: string) {
    this.client = new Client({ auth: apiKey });
    this.pageParentId = pageParentId;
  }

  async findById(id: ProjectId): Promise<Project | undefined> {
    if (!id.notion) {
        return undefined;
    };

    try {
      const page = await this.client.pages.retrieve({ page_id: id.notion });

      if (!("properties" in page)) {
        return undefined;
      };

      const titleProp = Object.values(page.properties).find((p) => p.type === "title");
      const name =
        titleProp?.type === "title"
          ? titleProp.title.map((t) => t.plain_text).join("")
          : "";

      const notionUrl = `https://www.notion.so/${page.id.replace(/-/g, "")}`;

      return {
        id,
        url: { todoist: id.todoist ? `https://todoist.com/app/project/${id.todoist}` : "", notion: notionUrl },
        name,
        viewStyle: "list",
      };
    } catch {
      return undefined;
    }
  }

  async create(project: Project, sections: Section[], labels: Label[]): Promise<Project> {
    const page = await this.createPage(project);
    const database = await this.createDatabase(page, sections, labels);

    let notionUrl: string | undefined;

    if ("url" in page) {
      notionUrl = page.url;
    }

    return {
      ...project,
      id: { ...project.id, notion: page.id },
      url: { ...project.url, notion: notionUrl },
      notionDatabaseId: database.id,
    };
  }

  private createPage(project: Project): Promise<CreatePageResponse> {
    return this.client.pages.create({
      parent: {
        type: "page_id",
        page_id: this.pageParentId,
      },
      template: {
        type: "none",
      },
      properties: {
        title: {
          type: "title",
          title: [{ type: "text", text: { content: project.name } }],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Page synced with ",
                },
              },
              {
                type: "text",
                text: {
                  content: `Todoist ${project.name}`,
                  link: { url: project.url.todoist },
                },
              }
            ],
          },
        }
      ],
    });
  }

  private createDatabase(page: CreatePageResponse, sections: Section[], labels: Label[]): Promise<CreateDatabaseResponse> {
    return this.client.databases.create({
      parent: {
        type: "page_id",
        page_id: page.id,
      },
      title: [
        {
          type: "text",
          text: {
            content: "Tasks",
          },
        }
      ],
      is_inline: true,
      initial_data_source: {
        properties: {
          "Name": {
            type: "title",
            title: {}
          },
          "Status": {
            type: "select",
            select: {
              options: labels.map((l) => ({
                name: l.name,
                color: l.color,
              }))
            }
          },
          "Description": {
            type: "rich_text",
            rich_text: {}
          },
          "Date": {
            type: "date",
            date: {}
          },
          "Deadline": {
            type: "date",
            date: {}
          },
          "Section": {
            type: "select",
            select: {
              options: sections.map((s) => ({
                name: s.name,
                color: "gray",
              }))
            }
          },
          "Labels": {
            type: "select",
            select: {
              options: labels.map((l) => ({
                name: l.name,
                color: l.color,
              }))
            }
          },
          "Priority": {
            type: "select",
            select: {
              options: [...TaskPriorities]
            }
          }
        }
      }
    });
  }
}
