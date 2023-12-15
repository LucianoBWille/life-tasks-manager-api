import { Test, TestingModule } from '@nestjs/testing';
import { TaskResponsibleService } from './task-responsible.service';

describe('TaskResponsibleService', () => {
  let service: TaskResponsibleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskResponsibleService],
    }).compile();

    service = module.get<TaskResponsibleService>(TaskResponsibleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
