import { Client } from "@notionhq/client";
import type { Project } from "../domain/Project.js";
import type { ProjectRepository } from "../domain/ProjectRepository.js";

export class NotionProjectRepository implements ProjectRepository {
  private readonly client: Client;
  private readonly rootPageId: string;

  constructor(apiToken: string, rootPageId: string) {
    this.client = new Client({ auth: apiToken });
    this.rootPageId = rootPageId;
  }

  async findAll(): Promise<Project[]> {
    const response = await this.client.search({
      filter: { property: "object", value: "page" },
    });
    return response.results.map((page) => ({
      id: page.id,
      name: page.id, // placeholder - real name mapping TBD
      isShared: false,
      isFavorite: false,
    }));
  }

  async findById(id: string): Promise<Project | undefined> {
    const page = await this.client.pages.retrieve({ page_id: id });
    return { id: page.id, name: page.id, isShared: false, isFavorite: false };
  }

  async save(project: Project): Promise<void> {
    await this.client.pages.create({
      parent: { type: "page_id", page_id: this.rootPageId },
      properties: {
        title: {
          type: "title",
          title: [{ type: "text", text: { content: project.name } }],
        },
      },
    });
  }
}
