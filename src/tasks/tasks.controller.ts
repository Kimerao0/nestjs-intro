import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from 'src/tasks/create-task.dto';
import { FindOneParams } from 'src/tasks/find-one-params';
import { TasksService } from 'src/tasks/tasks.service';
import { WrongStatusException } from 'src/tasks/exceptions/wrong-task-status.exception';
import { Task } from 'src/tasks/task.entity';
import { CreateTaskLabelDto } from 'src/tasks/create-task-label-dto';
import { FindTaskParams } from 'src/tasks/find-task.params';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginationResponse } from 'src/common/pagination.response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Get()
  public async findAll(@Query() filters: FindTaskParams, @Query() pagination: PaginationParams): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(filters, pagination);
    return {
      data: items,
      meta: {
        total,
        offset: pagination.offset,
        limit: pagination.limit,
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() body: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(body);
  }

  @Patch('/:id')
  public async updateTask(@Param() params: FindOneParams, @Body() body: UpdateTaskDto): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.tasksService.updateTask(task, body);
    } catch (error) {
      if (error instanceof WrongStatusException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    this.tasksService.deleteTask(task);
  }

  @Post('/:id/labels')
  async addLabels(@Param() { id }: FindOneParams, @Body() labels: CreateTaskLabelDto[]): Promise<Task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.addLabels(task, labels);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLabels(@Param() { id }: FindOneParams, @Body() labels: string[]): Promise<void> {
    const task = await this.findOneOrFail(id);
    await this.tasksService.removeLabels(task, labels);
  }
}
