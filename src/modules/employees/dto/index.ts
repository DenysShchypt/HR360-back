import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Validate,
} from 'class-validator';
import { DepartmentExistsValidator } from 'common/validators/department-exists.validator';
import { EmploymentType, StatusType } from 'interfaces/employees';

export class EmployeeDto {
  @ApiProperty({ example: 'Denys Nest' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Wrong length' })
  @IsAlpha('en-US', {
    message: 'Field must contain only Latin alphabet characters',
  })
  name: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsNotEmpty()
  @IsUrl()
  photo: string;

  @ApiProperty({ example: 'Back-end Developer' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 'Full-Time' })
  @IsNotEmpty()
  @IsEnum(EmploymentType, {
    message: 'Employment must be Full-Time, Part-Time, or Contract',
  })
  employment: EmploymentType;

  @ApiProperty({ example: 'Present' })
  @IsNotEmpty()
  @IsEnum(StatusType, {
    message: 'Employment must be Present, Late, or Absent',
  })
  status: StatusType;

  @IsNotEmpty()
  @IsString()
  checkIn: string;

  @IsNotEmpty()
  @IsString()
  checkOut: string;

  @IsOptional()
  @IsString()
  overTime?: string;

  @ApiProperty({ example: 'Software Development' })
  @IsNotEmpty()
  @IsString()
  @Validate(DepartmentExistsValidator, { message: 'Invalid department name' })
  department: string;
}
