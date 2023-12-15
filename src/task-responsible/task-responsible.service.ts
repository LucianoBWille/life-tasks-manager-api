import { Injectable } from '@nestjs/common';
import { CreateTaskResponsibleDto } from './dto/create-task-responsible.dto';
import { UpdateTaskResponsibleDto } from './dto/update-task-responsible.dto';

@Injectable()
export class TaskResponsibleService {
  create(createTaskResponsibleDto: CreateTaskResponsibleDto) {
    return 'This action adds a new taskResponsible';
  }

  findAll() {
    return `This action returns all taskResponsible`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskResponsible`;
  }

  update(id: number, updateTaskResponsibleDto: UpdateTaskResponsibleDto) {
    return `This action updates a #${id} taskResponsible`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskResponsible`;
  }
}
