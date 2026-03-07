import type { Task } from "./Task.js";

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findByProjectId(projectId: string): Promise<Task[]>;
  save(task: Task): Promise<void>;
}
