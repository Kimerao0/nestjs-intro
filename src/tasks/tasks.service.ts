import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WrongStatusException } from 'src/tasks/exceptions/wrong-task-status.exception';
import { CreateTaskDto, UpdateTaskDto } from 'src/tasks/create-task.dto';
import { Task } from 'src/tasks/task.entity';
import { TaskStatus } from 'src/tasks/task.model';
import { Repository } from 'typeorm';
import { CreateTaskLabelDto } from 'src/tasks/create-task-label-dto';
import { TaskLabel } from 'src/tasks/task-label.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id }, relations: ['labels'] });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.save(createTaskDto);
  }

  public async addLabels(task: Task, labelsDtos: CreateTaskLabelDto[]): Promise<Task> {
    const labels = labelsDtos.map((label) => this.labelsRepository.create(label));
    task.labels = [...task.labels, ...labels];
    return await this.taskRepository.save(task);
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
