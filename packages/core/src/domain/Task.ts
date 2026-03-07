export interface Task {
  id: string;
  projectId: string;
  content: string;
  description?: string;
  priority: 1 | 2 | 3 | 4;
  labels: string[];
  due?: { date: string; datetime?: string };
  isCompleted: boolean;
}
