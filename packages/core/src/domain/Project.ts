export interface ProjectId {
  todoist: string;
  notion?: string;
};

export interface ProjectUrl {
  todoist: string;
  notion?: string;
};

export interface Project {
  id: ProjectId;
  url: ProjectUrl;
  name: string;
  viewStyle: "list" | "board" | "calendar";
  notionDatabaseId?: string;
  parentId?: ProjectId;
}

export interface Section {
  id: string;
  name: string;
}
