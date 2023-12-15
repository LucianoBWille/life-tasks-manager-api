import { PartialType } from '@nestjs/swagger';
import { CreateTaskResponsibleDto } from './create-task-responsible.dto';

export class UpdateTaskResponsibleDto extends PartialType(CreateTaskResponsibleDto) {}
