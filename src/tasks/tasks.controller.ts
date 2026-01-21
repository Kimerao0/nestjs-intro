import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/create-task.dto';
import { type ITask } from 'src/tasks/task.model';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param('id') id: string): ITask {
    const task = this.tasksService.findOne(id);
    if (task) {
      return task;
    }
    throw new NotFoundException(`Task with ID ${id} not found`);
  }

  @Post()
  public create(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.create(createTaskDto);
  }
}
