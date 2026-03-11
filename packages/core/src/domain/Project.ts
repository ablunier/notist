export type ProjectId = {
  todoist: string;
  notion?: string;
};

export type ProjectUrl = {
  todoist: string;
  notion?: string;
};

export interface Project {
  id: ProjectId;
  url: ProjectUrl;
  name: string;
  parentId?: ProjectId;
}
