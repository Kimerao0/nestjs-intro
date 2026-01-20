import { Controller, Get, Param } from '@nestjs/common';
import { ITask } from 'src/tasks/task.model';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param('id') id: string): ITask | undefined {
    return this.tasksService.findOne(id);
  }
}
