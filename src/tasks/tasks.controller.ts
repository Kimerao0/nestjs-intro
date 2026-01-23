import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateTaskDto, UpdateStatusDto, UpdateTaskDto } from 'src/tasks/task.dto';
import { FindOneParams } from 'src/tasks/find-one-params';
import { type ITask } from 'src/tasks/task.model';
import { TasksService } from 'src/tasks/tasks.service';
import { WrongStatusException } from 'src/tasks/exceptions/wrong-task-status.exception';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): ITask {
    return this.findOneOrFail(params.id);
  }

  @Post()
  public create(@Body() body: CreateTaskDto): ITask {
    return this.tasksService.create(body);
  }

  @Patch('/:id/status')
  public updateTaskStatus(@Param() params: FindOneParams, @Body() body: UpdateStatusDto) {
    const task = this.findOneOrFail(params.id);
    task.status = body.status;
    return task;
  }
  @Patch('/:id')
  public updateTask(@Param() params: FindOneParams, @Body() body: UpdateTaskDto): ITask {
    const task = this.findOneOrFail(params.id);
    try {
      return this.tasksService.updateTask(task, body);
    } catch (error) {
      if (error instanceof WrongStatusException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteTask(@Param() params: FindOneParams): void {
    const task = this.findOneOrFail(params.id);
    this.tasksService.deleteTask(task);
  }
}
