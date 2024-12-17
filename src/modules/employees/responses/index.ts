import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUrl } from 'class-validator';

export class EmployeeResponse {
  @ApiProperty({ example: '674cac8080acdb062f3e5d1f' })
  @IsString()
  @Expose()
  id: string;
  @ApiProperty({ example: 'Denys Dev' })
  @IsString()
  @Expose()
  name: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsUrl()
  @Expose()
  photo?: string;
  @ApiProperty({ example: 'Software Development' })
  @IsString()
  @Expose()
  role: string;
  @ApiProperty({ example: 'Full-time' })
  @IsString()
  @Expose()
  employment: string;
  @ApiProperty({ example: 'Present' })
  @IsString()
  @Expose()
  status: string;
  @ApiProperty({ example: '4:19 AM' })
  @IsString()
  @Expose()
  checkIn: string;
  @ApiProperty({ example: '8:50 AM' })
  @IsString()
  @Expose()
  checkOut: string;
  @ApiProperty({ example: '2h' })
  @IsString()
  @Expose()
  overTime?: string;
  @ApiProperty({ example: '674f5e27b651a7bb17193f0e' })
  @IsString()
  @Expose()
  departmentId: string;
  @ApiProperty({ example: '674f5e27b651a7bb17193f0e' })
  @IsString()
  @Expose()
  userId: string;
}
