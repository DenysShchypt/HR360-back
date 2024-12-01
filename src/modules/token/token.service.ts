import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUserJWT } from 'interfaces/auth';
import { PrismaService } from 'modules/prisma/prisma.service';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private async generateToken(user: IUserJWT, agent: string) {
    const payload = { user };
    const token =
      'Bearer ' +
      this.jwtService.sign(payload, {
        secret: this.configService.get('secret_jwt'),
        expiresIn: this.configService.get('expire_jwt'),
      });
    return token;
  }
  async generateJwtToken(user: IUserJWT, agent: string) {
    return await this.generateToken(user, agent);
  }
}
