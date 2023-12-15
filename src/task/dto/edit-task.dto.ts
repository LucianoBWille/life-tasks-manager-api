// import { TaskResponsible } from '@prisma/client';
import { IsBoolean, IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class EditTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  // @IsOptional()
  // responsibles?: TaskResponsible[];
}
