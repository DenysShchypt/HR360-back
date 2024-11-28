import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Denys' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @IsAlpha('en-US', {
    message: 'Field must contain only Latin alphabet characters',
  })
  username: string;
  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiPropertyOptional()
  @ValidateIf((o) => o.provider !== 'GOOGLE')
  @IsNotEmpty()
  @IsString()
  @Length(10, 20)
  @Matches(/^.*$/, { message: 'Field must contain any characters' })
  password?: string;
  @ApiPropertyOptional({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @IsString()
  @IsOptional()
  photo?: string;
}
