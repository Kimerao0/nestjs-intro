import { TaskStatus } from 'src/tasks/task.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskLabelDto } from 'src/tasks/create-task-label-dto';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskLabelDto)
  labels?: CreateTaskLabelDto[];
}

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
