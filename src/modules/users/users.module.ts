import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from 'modules/prisma/prisma.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
