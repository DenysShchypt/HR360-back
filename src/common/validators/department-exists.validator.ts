import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaService } from 'modules/prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class DepartmentExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(value: string): Promise<boolean> {
    const department = await this.prismaService.departments.findFirst({
      where: {
        OR: [{ id: value }, { name: value }],
      },
    });
    return !!department;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Department with name "${args.value}" does not exist.`;
  }
}
