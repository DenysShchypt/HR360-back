import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
  @ApiProperty({ example: '674cac8080acdb062f3e5d1f' })
  @Expose()
  id: string;
  @ApiProperty({ example: 'Denys' })
  @Expose()
  username: string;
  @ApiProperty({ example: 'developer@mail.org' })
  @Expose()
  email: string;
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocJ-OcEr6cr50Ak6Sz7LGMK6MXRH44O0ULhXbAtpn6lMa0OGlgQ=s96-c',
  })
  @Expose()
  photo?: string;

  @Exclude()
  password: string;
}
