import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WrongStatusException } from 'src/tasks/exceptions/wrong-task-status.exception';
import { CreateTaskDto, UpdateTaskDto } from 'src/tasks/task.dto';
import { Task } from 'src/tasks/task.entity';
import { TaskStatus } from 'src/tasks/task.model';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOneBy({ id });
  }

  public async createTask(createTskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.save(createTskDto);
  }

  private isValidStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): boolean {
    const statusOrder = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public async updateTask(task: Task, updatingTask: UpdateTaskDto): Promise<Task> {
    if (updatingTask.status && !this.isValidStatusTransition(task.status, updatingTask.status)) {
      throw new WrongStatusException();
    }
    Object.assign(task, updatingTask);
    return await this.taskRepository.save(task);
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.taskRepository.delete(task);
  }
}
