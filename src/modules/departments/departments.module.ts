import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaService } from 'modules/prisma/prisma.service';

@Module({
  providers: [DepartmentsService, PrismaService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
