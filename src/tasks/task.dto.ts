import { TaskStatus } from 'src/tasks/task.model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
