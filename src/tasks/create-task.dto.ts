import { TaskStatus } from 'src/tasks/task.model';

export class CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}
