import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { WrongStatusException } from 'src/tasks/exceptions/wrong-task-status.exception';
import { CreateTaskDto, UpdateTaskDto } from 'src/tasks/task.dto';
import { ITask, TaskStatus } from 'src/tasks/task.model';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  public findAll(): ITask[] {
    return this.tasks;
  }

  public findOne(id: string): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public create(createTskDto: CreateTaskDto): ITask {
    const task: ITask = {
      id: randomUUID(),
      ...createTskDto,
    };
    this.tasks.push(task);
    return task;
  }

  private isValidStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): boolean {
    const statusOrder = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public updateTask(originalTask: ITask, updatingTask: UpdateTaskDto): ITask {
    if (updatingTask.status && !this.isValidStatusTransition(originalTask.status, updatingTask.status)) {
      throw new WrongStatusException();
    }
    Object.assign(originalTask, updatingTask);
    return originalTask;
  }

  public deleteTask(deletedTask: ITask): void {
    this.tasks = this.tasks.filter((task) => task.id !== deletedTask.id);
  }
}
