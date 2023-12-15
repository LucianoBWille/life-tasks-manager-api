import { Test, TestingModule } from '@nestjs/testing';
import { TaskResponsibleController } from './task-responsible.controller';
import { TaskResponsibleService } from './task-responsible.service';

describe('TaskResponsibleController', () => {
  let controller: TaskResponsibleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskResponsibleController],
      providers: [TaskResponsibleService],
    }).compile();

    controller = module.get<TaskResponsibleController>(TaskResponsibleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
