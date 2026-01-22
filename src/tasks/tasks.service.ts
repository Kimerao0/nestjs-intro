import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTaskDto, UpdateTaskDto } from 'src/tasks/task.dto';
import { ITask } from 'src/tasks/task.model';

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

  public updateTask(originalTask: ITask, updatingTask: UpdateTaskDto): ITask {
    Object.assign(originalTask, updatingTask);
    return originalTask;
  }

  public deleteTask(deletedTask: ITask): void {
    this.tasks = this.tasks.filter((task) => task.id !== deletedTask.id);
  }
}
