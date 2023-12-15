import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.password;

    return user;
  }

  async deleteUser(id: number) {
    // using prisma transaction (to delete user and all related data)
    // call prisma delete user
    // call prisma delete tasks
    // call prisma delete task responsibles
    const [userResult, taskResult, taskResponsibleResult] =
      await this.prisma.$transaction([
        this.prisma.user.delete({
          where: {
            id,
          },
        }),
        this.prisma.task.deleteMany({
          where: {
            creatorId: id,
          },
        }),
        this.prisma.taskResponsible.deleteMany({
          where: {
            userId: id,
          },
        }),
      ]);

    return {
      userResult,
      taskResult,
      taskResponsibleResult,
    };
  }
}
