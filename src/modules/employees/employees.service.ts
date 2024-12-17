import { BadRequestException, Injectable } from '@nestjs/common';
import { AppError } from 'constants/errors';
import { PrismaService } from 'modules/prisma/prisma.service';
import { EmployeeDto } from './dto';
import { Cron } from '@nestjs/schedule';
import { EmployeeResponse } from './responses';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllEmployees(): Promise<EmployeeResponse[]> {
    const res = await this.prismaService.employees.findMany();
    if (!res) throw new BadRequestException(AppError.WRONG_DATA);
    return res;
  }
  async addEmployees(id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    const isEmployee = await this.prismaService.employees.findUnique({
      where: { name: dto.name },
    });
    if (isEmployee)
      throw new BadRequestException(AppError.EMPLOYEE_ALREADY_EXISTS);

    const getDepartment = await this.getDepartmentByName(dto.department);

    if (!getDepartment) {
      throw new BadRequestException('Department not found.');
    }

    await this.updateDepartmentHeadcount(getDepartment.id, 1);

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

  async editEmployee(
    id: string,
    dto: EmployeeDto,
    employeeId: string,
  ): Promise<EmployeeResponse> {
    const getEmployee = await this.getEmployeeById(employeeId);

    if (!getEmployee) {
      throw new BadRequestException('Employee not found');
    }

    const getNewDepartment = await this.getDepartmentByName(dto.department);

    if (getEmployee.department.id !== getNewDepartment.id) {
      await this.updateDepartmentHeadcount(getEmployee.department.id, -1);
      await this.updateDepartmentHeadcount(getNewDepartment.id, 1);
    }

    const updateEmployee = await this.prismaService.employees.update({
      where: { id: employeeId },
      data: {
        name: dto.name,
        photo: dto.photo,
        role: dto.role,
        employment: dto.employment,
        status: dto.status,
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        overTime: dto.overTime,
        userId: id,
        departmentId: getNewDepartment.id,
      },
    });
    return updateEmployee;
  }

  async removeEmployee(id: string, employeeId: string): Promise<void> {
    const getEmployee = await this.getEmployeeById(employeeId);

    if (!getEmployee) {
      throw new BadRequestException('Employee not found');
    }

    await this.prismaService.employees.delete({
      where: { id: employeeId },
    });

    await this.updateDepartmentHeadcount(getEmployee.department.id, 1);

    return;
  }

  private async getEmployeeById(employeeId: string) {
    return await this.prismaService.employees.findUnique({
      where: { id: employeeId },
      include: { department: true },
    });
  }

  private async getDepartmentByName(name: string) {
    return await this.prismaService.departments.findUnique({
      where: { name },
    });
  }

  private async updateDepartmentHeadcount(
    departmentId: string,
    change: number,
  ) {
    await this.prismaService.departments.update({
      where: { id: departmentId },
      data: {
        totalEmployee: {
          increment: change,
        },
        headcountChange: {
          increment: change,
        },
      },
    });
  }
  @Cron('0 0 1 * *')
  async resetHeadcountChange() {
    await this.prismaService.departments.updateMany({
      data: { headcountChange: 0 },
    });
  }
}
