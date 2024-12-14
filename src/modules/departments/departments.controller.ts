import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guards/jwt-guard';
import { DepartmentsService } from './departments.service';

@ApiTags('API')
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @ApiResponse({ status: 200 })
  @Get()
  async getAllDepartments() {
    return await this.departmentService.getAllDepartments();
  }
}
