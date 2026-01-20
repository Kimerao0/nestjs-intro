export interface ITask {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
}

enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
