import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @ApiProperty({
    example: 'superSecretPassword@2025',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({ example: 'Denys' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @IsAlpha('en-US', {
    message: 'Field must contain only Latin alphabet characters',
  })
  username: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsUrl()
  @IsOptional()
  photo?: string;
}
