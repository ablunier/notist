import { TodoistApi } from "@doist/todoist-api-typescript";
import { Client } from "@notionhq/client";
import "dotenv/config";

const todoist = new TodoistApi(process.env.TODOIST_KEY as string);

const notion = new Client({ auth: process.env.NOTION_KEY });

const projects = await todoist.getProjects();

console.log(projects);

const pages = await notion.search({
  filter: { property: "object", value: "page" },
});

console.log(pages);

const projectPage = await notion.pages.create({
  parent: {
    type: "page_id",
    page_id: process.env.NOTION_PAGE_ID as string,
  },
  template: {
    type: "none",
  },
  properties: {
    title: {
      type: "title",
      title: [{ type: "text", text: { content: "Project synced from Todoist" } }],
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
              content: "Todoist test project",
              link: { url: "https://app.todoist.com/app/project/test-project" },
            },
          }
        ],
      },
    }
  ],
});

console.log(projectPage);

const tasksDatabase = await notion.databases.create({
  parent: {
    type: "page_id",
    page_id: projectPage.id,
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
      "Labels": {
        type: "select",
        select: {
          options: [
            {
              name: "xuntanza",
              color: "blue",
            },
            {
              name: "meta-tarefa",
              color: "gray",
            },
          ]
        }
      },
      "Priority": {
        type: "select",
        select: {
          options: [
            {
              name: "P1",
              color: "red",
            },
            {
              name: "P2",
              color: "orange",
            },
            {
              name: "P3",
              color: "blue",
            },
            {
              name: "P4",
              color: "gray",
            },
          ]
        }
      }
    }
  }
});

console.log(tasksDatabase);
