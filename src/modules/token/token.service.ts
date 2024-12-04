import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { IUserJWT } from 'interfaces/auth';
import { PrismaService } from 'modules/prisma/prisma.service';
import { UsersService } from 'modules/users/users.service';
import { add } from 'date-fns';
import { AuthAllResponse, RefreshToken, Tokens } from 'modules/auth/responses';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private async generateToken(user: IUserJWT, agent: string): Promise<Tokens> {
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

  private async generateRefreshToken(id, agent): Promise<RefreshToken> {
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
  async generateJwtToken(user: IUserJWT, agent: string): Promise<Tokens> {
    return await this.generateToken(user, agent);
  }

  async refreshTokens(
    refreshToken: string,
    agent: string,
  ): Promise<AuthAllResponse> {
    const token = await this.prismaService.token.findUnique({
      where: { token: refreshToken },
    });
    if (!token || new Date(token.exp) < new Date())
      throw new UnauthorizedException();

    const user = await this.usersService.getUserData(token.userId, true);
    const tokens = await this.generateToken(user, agent);
    return { ...user, tokens: tokens };
  }
}
