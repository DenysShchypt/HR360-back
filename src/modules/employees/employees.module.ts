import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaService } from 'modules/prisma/prisma.service';
import { DepartmentExistsValidator } from 'common/validators/department-exists.validator';

@Module({
  providers: [EmployeesService, PrismaService, DepartmentExistsValidator],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
