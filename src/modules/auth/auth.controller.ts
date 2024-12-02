import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UserAgent } from '../../../libs/decorators/user-agent.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthUserResponse } from './responses';
import { Response } from 'express';

const REFRESH_TOKEN = 'fresh';

@ApiTags('API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({ status: 201, type: AuthUserResponse })
  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokensAndUser = await this.authService.registerUser(dto, agent);
    res.status(HttpStatus.OK).json({ ...tokensAndUser });
  }

  @Get('verify/:token')
  async verifyToken(
    @Param('token') token: string,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<void> {
    const userVerify = await this.authService.verifyRegisterUser(token, agent);
    this.setRefreshCookieVerify(userVerify, res);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ) {
    const loginUser = await this.authService.loginUser(dto, agent);
    res.status(HttpStatus.OK).json({ ...loginUser });
  }
  // @UseGuards(JwtAuthGuard)
  // @Get('logout')
  // async logout(): Promise<void> {
  //   // await this.authService.logout(id, agent);
  // }

  setRefreshCookieVerify(userVerify, res) {
    if (!userVerify) throw new UnauthorizedException();
    res.cookie(REFRESH_TOKEN, userVerify.tokens.refreshToken.token, {
      httpOnly: true, // Кука доступна тільки через HTTP, і не доступна через JavaScript
      sameSite: 'none',
      expires: new Date(userVerify.tokens.refreshToken.exp), // Дата закінчення дії куки
      secure: true, // Кука буде передаватись тільки по HTTPS, якщо середовище - production
      path: '/', // Шлях, де кука буде доступна
    });
    res.redirect(this.configService.get('base_url_client'));
  }

  setRefreshToken(refreshUser, res) {
    if (!refreshUser) throw new UnauthorizedException();
    res.cookie(REFRESH_TOKEN, refreshUser.tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'none',
      expires: new Date(refreshUser.tokens.refreshToken.exp),
      secure: true,
      path: '/',
    });
    res.status(HttpStatus.OK).json({ ...refreshUser });
  }

  @Get('check-server')
  async checkServer(): Promise<string> {
    return 'Server is running!';
  }
}
