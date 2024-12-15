import { BadRequestException, Injectable } from '@nestjs/common';
import { AppError } from 'constants/errors';
import { PrismaService } from 'modules/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEmployees() {
    const res = await this.prismaService.employee.findMany();

    return res;
  }
  async addEmployees(id, dto) {
    const isEmployee = await this.prismaService.employee.findUnique({
      where: { name: dto.name },
    });
    if (isEmployee)
      throw new BadRequestException(AppError.EMPLOYEE_ALREADY_EXISTS);

    const department = await this.prismaService.departments.findUnique({
      where: { name: dto.department },
    });

    if (!department) {
      throw new Error('Department not found');
    }

    // Create a new employee and link it to the found department
    const newEmployee = await this.prismaService.employee.create({
      data: {
        ...dto,
        departmentId: department.id, // Associate with the found department
      },
    });

    return newEmployee;
  }
}
