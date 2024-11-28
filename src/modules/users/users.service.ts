import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'modules/prisma/prisma.service';
import { Cache } from 'cache-manager';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto';
import { USER_SELECT_FIELDS } from 'constants/select-return';
import sendEmail from '../../../libs/nodemailer';

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

  async createUser(dto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      await this.cacheManager.set(user._id, user);
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
      const verifyEmail = {
        from: {
          name: 'PetProject',
          address: this.configService.get('mail_from'),
        },
        to: createNewUser.email,
        subject: 'Verify email',
        html: `<p><strong>Hello ${createNewUser.firstName} ${createNewUser?.lastName}</strong>, you need to confirm your email<a target="_blank" href="${this.configService.get('base_url')}/auth/verify/${createNewUser.verifyLink}">Click verify here</a></p>`,
      };
      await sendEmail(verifyEmail);
      await this.cacheManager.set(createNewUser.id, createNewUser);
      await this.cacheManager.set(createNewUser.email, createNewUser);
      return createNewUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
