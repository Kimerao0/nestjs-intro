import { TaskStatus } from 'src/tasks/task.model';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
