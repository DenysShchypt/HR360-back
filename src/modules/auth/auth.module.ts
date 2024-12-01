import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'modules/prisma/prisma.service';
import { JwtStrategy } from 'strategy/jwtStrategy';
import { UsersModule } from 'modules/users/users.module';
import { TokenModule } from 'modules/token/token.module';

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
