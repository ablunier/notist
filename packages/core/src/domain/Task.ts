import type { ProjectId } from "./Project.js";

export type TaskId = {
  todoist: string;
  notion: string;
};

export type TaskUrl = {
  todoist: string;
  notion: string;
};

export type TaskPriority = 
  { name: "P1", color: "red" } | 
  { name: "P2", color: "yellow" } | 
  { name: "P3", color: "blue" } | 
  { name: "P4", color: "gray" };

export interface Task {
  id: TaskId;
  url: TaskUrl;
  projectId: ProjectId;
  name: string;
  description?: string;
  date?: Date;
  deadline?: Date;
  labels: string[];
  priority: TaskPriority;
}
