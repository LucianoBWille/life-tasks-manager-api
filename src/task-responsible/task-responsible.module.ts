import { Module } from '@nestjs/common';
import { TaskResponsibleService } from './task-responsible.service';
import { TaskResponsibleController } from './task-responsible.controller';

@Module({
  controllers: [TaskResponsibleController],
  providers: [TaskResponsibleService],
})
export class TaskResponsibleModule {}
