import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Cache } from 'cache-manager';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto';
import { USER_ALL_DATA, USER_SELECT_FIELDS } from 'constants/select-return';
// import sendEmail from '../../../libs/nodemailer';
import { ObjectId } from 'mongodb';
import { AppError } from 'constants/errors';
import { convertToSecondsUtil } from '../../../libs/decorators/convert-to-seconds.util';
import { UserResponse } from './responses';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); //????????????????
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async hasPassword(password: string, salt: string): Promise<string> {
    return bcryptjs.hashSync(password, salt);
  }
  private async validateId(id: string): Promise<boolean> {
    return ObjectId.isValid(id);
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      await this.cacheManager.set(user.id, user);
      await this.cacheManager.set(user.email, user);
    }
    if (user) return;
    if (dto.password) {
      const salt = await bcryptjs.genSalt(10);
      dto.password = await this.hasPassword(dto.password, salt);
    }

    try {
      const createNewUser = await this.prismaService.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: dto?.password,
          photo: dto?.photo,
        },
        select: USER_SELECT_FIELDS,
      });
      //   const verifyEmail = {
      //     from: {
      //       name: 'PetProject',
      //       address: this.configService.get('mail_from'),
      //     },
      //     to: createNewUser.email,
      //     subject: 'Verify email',
      //     html: `<p><strong>Hello ${createNewUser.username} </strong>, you need to confirm your email<a target="_blank" href="${this.configService.get('base_url')}/auth/verify/${createNewUser.verifyLink}">Click verify here</a></p>`,
      //   };
      //   await sendEmail(verifyEmail);
      await this.cacheManager.set(createNewUser.id, createNewUser);
      await this.cacheManager.set(createNewUser.email, createNewUser);
      return createNewUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getUserData(idOrEmail: string, isReset: boolean = false) {
    if (isReset) await this.cacheManager.del(idOrEmail);
    const user = await this.cacheManager.get<UserResponse>(idOrEmail);

    if (user) return user;
    const isId = await this.validateId(idOrEmail);
    const getUserFromDb = await this.prismaService.user.findFirst({
      where: isId ? { id: idOrEmail } : { email: idOrEmail },
      select: isId ? USER_SELECT_FIELDS : USER_ALL_DATA,
    });
    if (!getUserFromDb) throw new BadRequestException(AppError.USER_NOT_FOUND);
    const cacheExpiry = convertToSecondsUtil(
      this.configService.get('expire_jwt'),
    );
    await this.cacheManager.set(idOrEmail, getUserFromDb, cacheExpiry);
    return getUserFromDb;
  }
}
