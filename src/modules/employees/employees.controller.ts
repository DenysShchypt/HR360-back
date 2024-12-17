import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'guards/jwt-guard';
import { EmployeesService } from './employees.service';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { EmployeeDto } from './dto';
import { EmployeeResponse } from './responses';

@ApiTags('API')
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(EmployeeResponse) },
    },
  })
  @Get()
  async getAllEmployees(): Promise<EmployeeResponse[]> {
    return await this.employeesService.getAllEmployees();
  }

  @ApiResponse({ status: 201, type: EmployeeResponse })
  @Post('employee')
  async addEmployees(
    @Body() employeeDto: EmployeeDto,
    @CurrentUser('id') id: string,
  ): Promise<EmployeeResponse> {
    return await this.employeesService.addEmployees(id, employeeDto);
  }
  @ApiResponse({ status: 200, type: EmployeeResponse })
  @Patch('employee/:id')
  async editEmployees(
    @Body() employeeDto: EmployeeDto,
    @Param('id') employeeId: string,
    @CurrentUser('id') id: string,
  ): Promise<EmployeeResponse> {
    return await this.employeesService.editEmployee(
      id,
      employeeDto,
      employeeId,
    );
  }
  @ApiResponse({ status: 200 })
  @Delete('delete-employee/:id')
  async deleteEmployees(
    @Param('id') employeeId: string,
    @CurrentUser('id') id: string,
  ): Promise<void> {
    return await this.employeesService.removeEmployee(id, employeeId);
  }
}
