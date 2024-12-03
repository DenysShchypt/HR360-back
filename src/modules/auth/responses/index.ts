import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsString, ValidateNested } from 'class-validator';
import { UserResponse } from 'modules/users/responses';

export class RefreshToken {
  @ApiProperty({ example: '674f5e7ab651a7bb17193f12' })
  @IsString()
  @Expose()
  id: string;
  @ApiProperty({ example: '1940ab1d-4ffa-4803-8b31-a34b60c6dbf9' })
  @IsString()
  @Expose()
  token: string;
  @ApiProperty({ example: '2025-01-03T19:39:38.863Z' })
  @IsDate()
  @Expose()
  exp: Date;
  @ApiProperty({ example: '674f5e27b651a7bb17193f0e' })
  @IsString()
  @Expose()
  userId: string;
  @ApiProperty({ example: 'PostmanRuntime/7.43.0' })
  @IsString()
  @Expose()
  userAgent: string;
}

export class Tokens {
  @ApiProperty({
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiY2ViZXhpeTM0NkBsdXh5c3MuY29tIiwidXNlcm5hbWUiOiJEZW55cyIsImlkIjoiNjc0ZjVlMjdiNjUxYTdiYjE3MTkzZjBlIn0sImlhdCI6MTczMzI1NDc3OCwiZXhwIjoxNzMzMjU1Njc4fQ.Zpkn0KAaSWAXwTaG-U7iAzb69fZ2tkcJgxTrQ5wN6xQ',
  })
  @IsString()
  @Expose()
  token: string;
  @ApiProperty({ type: RefreshToken })
  @ValidateNested()
  @Type(() => RefreshToken)
  @Exclude()
  refreshToken: RefreshToken;
}

export class AuthAllResponse extends UserResponse {
  @ApiProperty({ type: Tokens })
  @ValidateNested()
  @Type(() => Tokens)
  @Expose()
  tokens: Tokens;
}
export class AuthRegisterResponse extends UserResponse {
  @ApiProperty({
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiY2ViZXhpeTM0NkBsdXh5c3MuY29tIiwidXNlcm5hbWUiOiJEZW55cyIsImlkIjoiNjc0ZjVlMjdiNjUxYTdiYjE3MTkzZjBlIn0sImlhdCI6MTczMzI1NDc3OCwiZXhwIjoxNzMzMjU1Njc4fQ.Zpkn0KAaSWAXwTaG-U7iAzb69fZ2tkcJgxTrQ5wN6xQ',
  })
  @IsString()
  @Expose()
  token: string;
}
