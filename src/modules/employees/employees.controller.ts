import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guards/jwt-guard';
import { EmployeesService } from './employees.service';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { EmployeeDto } from './dto';

@ApiTags('API')
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({ status: 200 })
  @Get()
  async getAllEmployees() {
    return await this.employeesService.getAllEmployees();
  }

  @ApiResponse({ status: 201 })
  @Post('employee')
  async addEmployees(
    @Body() employeeDto: EmployeeDto,
    @CurrentUser('id') id: string,
  ) {
    return await this.employeesService.addEmployees(id, employeeDto);
  }
  @ApiResponse({ status: 200 })
  @Delete('delete-employee')
  async deleteEmployees(
    @Query('id') employeeId: string,
    @CurrentUser('id') id: string,
  ) {
    return await this.employeesService.removeEmployee(id, employeeId);
  }
}
