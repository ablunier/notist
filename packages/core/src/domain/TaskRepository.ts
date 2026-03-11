import type { ProjectId } from "./Project.js";
import type { TaskId, Task } from "./Task.js";

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findByProjectId(projectId: ProjectId): Promise<Task[]>;
  findById(id: TaskId): Promise<Task | undefined>;
  save(task: Task): Promise<void>;
}
