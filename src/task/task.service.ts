import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, EditTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  getTasks(userId: number, filter: any) {
    return this.prisma.task.findMany({
      where: {
        creatorId: userId,
        ...filter,
      },
    });
  }

  getTaskById(userId: number, taskId: number) {
    return this.prisma.task.findUnique({
      where: {
        creatorId: userId,
        id: taskId,
      },
    });
  }

  createTask(userId: number, dto: CreateTaskDto) {
    console.log('userId', userId);
    console.log('dto', dto);
    return this.prisma.task.create({
      data: {
        ...dto,
        creatorId: userId,
      },
    });
  }

  editTask(userId: number, taskId: number, dto: EditTaskDto) {
    return this.prisma.task.update({
      where: {
        creatorId: userId,
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteTask(userId: number, taskId: number) {
    return this.prisma.task.delete({
      where: {
        creatorId: userId,
        id: taskId,
      },
    });
  }
}
