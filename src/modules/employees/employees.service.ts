import { BadRequestException, Injectable } from '@nestjs/common';
import { AppError } from 'constants/errors';
import { PrismaService } from 'modules/prisma/prisma.service';
import { EmployeeDto } from './dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEmployees() {
    const res = await this.prismaService.employees.findMany();

    return res;
  }
  async addEmployees(id: string, dto: EmployeeDto) {
    const isEmployee = await this.prismaService.employees.findUnique({
      where: { name: dto.name },
    });
    if (isEmployee)
      throw new BadRequestException(AppError.EMPLOYEE_ALREADY_EXISTS);

    const getDepartment = await this.prismaService.departments.findUnique({
      where: { name: dto.department },
    });

    if (!getDepartment) {
      throw new BadRequestException('Department not found.');
    }

    await this.prismaService.departments.update({
      where: { id: getDepartment.id },
      data: {
        totalEmployee: getDepartment.totalEmployee + 1,
        headcountChange: getDepartment.headcountChange + 1,
      },
    });

    const data = {
      userId: id,
      departmentId: getDepartment.id,
      name: dto.name,
      photo: dto.photo,
      role: dto.role,
      employment: dto.employment,
      status: dto.status,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      overTime: dto.overTime,
    };

    const newEmployee = await this.prismaService.employees.create({
      data,
    });

    return newEmployee;
  }

  async removeEmployee(id: string, employeeId: string) {
    const getEmployee = await this.prismaService.employees.findUnique({
      where: { id: employeeId },
      include: { department: true },
    });

    if (!getEmployee) {
      throw new BadRequestException('Employee not found');
    }

    const department = getEmployee.department;

    await this.prismaService.employees.delete({
      where: { id: employeeId },
    });

    await this.prismaService.departments.update({
      where: { id: department.id },
      data: {
        totalEmployee: department.totalEmployee - 1,
        headcountChange: department.headcountChange - 1,
      },
    });

    return;
  }

  @Cron('0 0 1 * *')
  async resetHeadcountChange() {
    await this.prismaService.departments.updateMany({
      data: { headcountChange: 0 },
    });
  }
}
