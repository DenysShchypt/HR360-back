import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'modules/prisma/prisma.service';
import { RegisterUserDto } from './dto';
import { UsersService } from 'modules/users/users.service';
import { AppError } from 'constants/errors';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async registerUser(dto: RegisterUserDto, agent: string) {
    const addNewUser = await this.userService.createUser(dto).catch((error) => {
      this.logger.error(`Error while registering user: ${error.message}`);
      return null;
    });
    if (!addNewUser) throw new BadRequestException(AppError.USER_EXIST);
  }
}
