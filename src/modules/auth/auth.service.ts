import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'modules/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UsersService } from 'modules/users/users.service';
import { AppError } from 'constants/errors';
import { TokenService } from 'modules/token/token.service';
import { UserResponse } from 'modules/users/responses';
import { AuthAllResponse } from './responses';
import { USER_SELECT_FIELDS } from 'constants/select-return';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(
    dto: RegisterUserDto,
    agent: string,
  ): Promise<AuthAllResponse> {
    const addNewUser = (await this.userService
      .createUser(dto)
      .catch((error) => {
        this.logger.error(`${AppError.ERROR_REGISTRATION}:${error.message}`);
        return null;
      })) as UserResponse;
    if (!addNewUser) throw new BadRequestException(AppError.USER_EXIST);
    const payload = {
      email: dto.email,
      username: dto.username,
      id: addNewUser.id,
    };
    const tokens = await this.tokenService.generateJwtToken(payload, agent);
    return { ...addNewUser, tokens };
  }

  async verifyRegisterUser(verifyLink: string, agent: string) {
    const existUser = await this.prismaService.user.findFirst({
      where: { verifyLink },
    });
    if (!existUser)
      throw new BadRequestException(AppError.VERIFY_TOKEN_NOT_FOUND);
    const updateUser = await this.prismaService.user.update({
      where: { id: existUser.id },
      data: { verifyLink: 'active' },
      select: USER_SELECT_FIELDS,
    });
    const payload = {
      email: existUser.email,
      username: existUser.username,
      id: existUser.id,
    };

    const tokens = await this.tokenService.generateJwtToken(payload, agent);
    return {
      ...updateUser,
      tokens,
    };
  }

  async loginUser(dto: LoginUserDto, agent: string): Promise<AuthAllResponse> {
    const getUser = (await this.userService
      .getUserData(dto.email, true)
      .catch((error) => {
        this.logger.error(`${AppError.USER_NOT_EXIST} ${error.message}`);
        return null;
      })) as UserResponse;
    if (!getUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
    const isPasswordValid = await bcryptjs.compare(
      dto.password,
      getUser.password,
    );
    if (!isPasswordValid) throw new BadRequestException(AppError.WRONG_DATA);
    delete getUser.password;
    const payload = {
      email: getUser.email,
      username: getUser.username,
      id: getUser.id,
    };
    const tokens = await this.tokenService.generateJwtToken(payload, agent);
    return { ...getUser, tokens };
  }
  async deleteRefreshToken(token: string): Promise<void> {
    await this.prismaService.token.delete({
      where: { token },
    });
    return;
  }

  async getRefreshTokens(
    refreshToken: string,
    agent: string,
  ): Promise<AuthAllResponse> {
    return await this.tokenService.refreshTokens(refreshToken, agent);
  }
}
