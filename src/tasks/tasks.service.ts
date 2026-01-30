import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WrongStatusException } from 'src/tasks/exceptions/wrong-task-status.exception';
import { CreateTaskDto, UpdateTaskDto } from 'src/tasks/create-task.dto';
import { Task } from 'src/tasks/task.entity';
import { TaskStatus } from 'src/tasks/task.model';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateTaskLabelDto } from 'src/tasks/create-task-label-dto';
import { TaskLabel } from 'src/tasks/task-label.entity';
import { FindTaskParams } from 'src/tasks/find-task.params';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(filters: FindTaskParams, pagination: PaginationParams): Promise<[Task[], number]> {
    const query = this.taskRepository.createQueryBuilder('task').leftJoinAndSelect('task.labels', 'labels');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', { search: `%${filters.search}%` });
    }

    query.skip(pagination.offset).take(pagination.limit);

    return query.getManyAndCount();

    /*     const where: FindOptionsWhere<Task> = {};
    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search?.trim()) {
      where.title = Like(`%${filters.search}%`);
      where.description = Like(`%${filters.search}%`);
    }

    return await this.taskRepository.findAndCount({
      where,
      relations: ['labels'],
      skip: pagination.offset,
      take: pagination.limit,
    }); */
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id }, relations: ['labels'] });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  public async addLabels(task: Task, labelsDtos: CreateTaskLabelDto[]): Promise<Task> {
    const existingNames = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelsDtos)
      .filter((dto) => !existingNames.has(dto.name))
      .map((label) => this.labelsRepository.create(label));

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }
    return task;
  }

  private isValidStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): boolean {
    const statusOrder = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public async updateTask(task: Task, updatingTask: UpdateTaskDto): Promise<Task> {
    if (updatingTask.status && !this.isValidStatusTransition(task.status, updatingTask.status)) {
      throw new WrongStatusException();
    }
    if (updatingTask.labels) {
      updatingTask.labels = this.getUniqueLabels(updatingTask.labels);
    }
    Object.assign(task, updatingTask);
    return await this.taskRepository.save(task);
  }

  public async removeLabels(task: Task, labelsToBeRemoved: string[]): Promise<Task> {
    const taskLabels = task.labels.filter((label) => !labelsToBeRemoved.includes(label.name));
    task.labels = taskLabels;
    return await this.taskRepository.save(task);
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.taskRepository.remove(task);
  }

  private getUniqueLabels(labelDtos: CreateTaskLabelDto[]): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueNames.map((name) => ({
      name,
    }));
  }
}
