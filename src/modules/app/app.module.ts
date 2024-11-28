import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from 'configurations';
import { AuthModule } from 'modules/auth/auth.module';
import { DepartmentsModule } from 'modules/departments/departments.module';
import { EmployeesModule } from 'modules/employees/employees.module';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    AuthModule,
    DepartmentsModule,
    EmployeesModule,
    UsersModule,
  ],
})
export class AppModule {}
