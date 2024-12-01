import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'modules/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UsersService } from 'modules/users/users.service';
import { AppError } from 'constants/errors';
import { TokenService } from 'modules/token/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(dto: RegisterUserDto, agent: string) {
    const addNewUser = await this.userService.createUser(dto).catch((error) => {
      this.logger.error(`${AppError.ERROR_REGISTRATION}:${error.message}`);
      return null;
    });
    if (!addNewUser) throw new BadRequestException(AppError.USER_EXIST);
    const payload = {
      email: dto.email,
      username: dto.username,
      id: addNewUser.id,
    };
    const token: string = await this.tokenService.generateJwtToken(
      payload,
      agent,
    );
    return { ...addNewUser, token };
  }

  async loginUser(dto: LoginUserDto, agent: string) {
    const getUser = await this.userService
      .getUserData(dto.email, true)
      .catch((error) => {
        this.logger.error(`${AppError.USER_NOT_EXIST} ${error.message}`);
        return null;
      });
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
    const token = await this.tokenService.generateJwtToken(payload, agent);
    return { ...getUser, token };
  }
}
