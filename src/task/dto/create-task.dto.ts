// import { TaskResponsible } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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
