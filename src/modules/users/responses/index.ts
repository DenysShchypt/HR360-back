import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, IsUrl } from 'class-validator';

export class UserResponse {
  @ApiProperty({ example: '674cac8080acdb062f3e5d1f' })
  @IsString()
  @Expose()
  id: string;
  @ApiProperty({ example: 'Denys' })
  @IsString()
  @Expose()
  username: string;
  @ApiProperty({ example: 'developer@mail.org' })
  @IsEmail()
  @Expose()
  email: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsUrl()
  @Expose()
  photo?: string;
  @IsString()
  @Exclude()
  password: string;
  @ApiProperty({ example: 'bd21a422-2514-40af-8dee-766ff1a397e8' })
  @IsString()
  @Expose()
  verifyLink: string;
}
