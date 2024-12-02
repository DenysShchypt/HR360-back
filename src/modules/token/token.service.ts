import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { IUserJWT } from 'interfaces/auth';
import { PrismaService } from 'modules/prisma/prisma.service';
import { UsersService } from 'modules/users/users.service';
import { add } from 'date-fns';

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
    const refreshToken = await this.generateRefreshToken(user.id, agent);
    return { token, refreshToken };
  }

  private async generateRefreshToken(id, agent) {
    const _token = await this.prismaService.token.findFirst({
      where: { userId: id, userAgent: agent },
    });
    const token = _token?.token ?? '';
    return this.prismaService.token.upsert({
      where: { token },
      update: { token: v4(), exp: add(new Date(), { months: 1 }) },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId: id,
        userAgent: agent,
      },
    });
  }
  async generateJwtToken(user: IUserJWT, agent: string) {
    return await this.generateToken(user, agent);
  }
}
