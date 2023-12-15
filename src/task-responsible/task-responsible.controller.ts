import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskResponsibleService } from './task-responsible.service';
import { CreateTaskResponsibleDto } from './dto/create-task-responsible.dto';
import { UpdateTaskResponsibleDto } from './dto/update-task-responsible.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tasks-responsibles')
export class TaskResponsibleController {
  constructor(private readonly taskResponsibleService: TaskResponsibleService) {}

  @Post()
  create(@Body() createTaskResponsibleDto: CreateTaskResponsibleDto) {
    return this.taskResponsibleService.create(createTaskResponsibleDto);
  }

  @Get()
  findAll() {
    return this.taskResponsibleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskResponsibleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskResponsibleDto: UpdateTaskResponsibleDto) {
    return this.taskResponsibleService.update(+id, updateTaskResponsibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskResponsibleService.remove(+id);
  }
}
