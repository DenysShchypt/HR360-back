import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

import { EmploymentType, StatusType } from 'interfaces/employees';

export class EmployeeDto {
  @ApiProperty({ example: 'Denys Nest' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'Wrong length' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Field must contain only Latin alphabet characters and spaces',
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

  @ApiProperty({ example: 'Full-time' })
  @IsNotEmpty()
  @IsEnum(EmploymentType, {
    message: 'Employment must be Full-time, Part-time, or Contract',
  })
  employment: EmploymentType;

  @ApiProperty({ example: 'Present' })
  @IsNotEmpty()
  @IsEnum(StatusType, {
    message: 'Status must be Present, Late, or Absent',
  })
  status: StatusType;

  @IsNotEmpty()
  // @Matches(/^\d{2}:\d{2}$/, { message: 'Invalid time format (expected HH:mm)' })
  checkIn?: string;

  @IsNotEmpty()
  // @Matches(/^\d{2}:\d{2}$/, { message: 'Invalid time format (expected HH:mm)' })
  checkOut?: string;

  @IsOptional()
  @IsString()
  overTime?: string;

  @ApiProperty({ example: 'Software Development' })
  @IsNotEmpty()
  @IsString()
  department: string;
}
