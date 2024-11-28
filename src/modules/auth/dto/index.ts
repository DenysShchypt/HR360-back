import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'Denys' })
  @IsString()
  username: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsString()
  photo: string;
}
