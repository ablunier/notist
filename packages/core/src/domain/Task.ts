import type { ProjectId } from "./Project.js";

export interface TaskId {
  todoist: string;
  notion: string;
};

export interface TaskUrl {
  todoist: string;
  notion: string;
};

export const TaskPriorities = [
  { name: "P1", color: "red" },
  { name: "P2", color: "yellow" },
  { name: "P3", color: "blue" },
  { name: "P4", color: "gray" },
] as const;

export type TaskPriority = typeof TaskPriorities[number];

export interface Task {
  id: TaskId;
  url: TaskUrl;
  projectId: ProjectId;
  name: string;
  description?: string;
  date?: Date;
  deadline?: Date;
  labels: Label[];
  priority: TaskPriority;
}

export type LabelColor = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
}
