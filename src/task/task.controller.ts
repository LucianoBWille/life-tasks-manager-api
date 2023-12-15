import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateTaskDto, EditTaskDto } from './dto';
import { TaskService } from './task.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  //get all user tasks
  @Get()
  // TODO - need to add a dto for filter
  getAllTasks(@GetUser('id') userId: number, @Body() filter: any) {
    return this.taskService.getTasks(userId, filter);
  }

  //get task by id
  @Get(':id')
  getTaskById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.getTaskById(userId, taskId);
  }

  //create task
  @Post()
  createTask(@GetUser('id') userId: number, @Body() dto: CreateTaskDto) {
    console.log('userId', userId);
    console.log('dto', dto);
    return this.taskService.createTask(userId, dto);
  }

  //edit task
  @Patch(':id')
  editTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: EditTaskDto,
  ) {
    return this.taskService.editTask(userId, taskId, dto);
  }

  //delete task
  @Delete(':id')
  deleteTask(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTask(userId, taskId);
  }
}
