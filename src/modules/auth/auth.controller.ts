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
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UserAgent } from '../../../libs/decorators/user-agent.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthAllResponse, AuthRegisterResponse } from './responses';
import { Response } from 'express';
import { Cookie } from '../../../libs/decorators/cookies.decorator';

const REFRESH_TOKEN = 'fresh';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({ status: 201, type: AuthRegisterResponse })
  @Post('register')
  async register(
    @Body()
    dto: RegisterUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokensAndUser = await this.authService.registerUser(dto, agent);
    delete tokensAndUser.tokens.refreshToken;
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
  @ApiExtraModels(AuthAllResponse)
  @ApiExtraModels(AuthRegisterResponse)
  @ApiResponse({
    status: 200,
    description: 'Different responses based on user verification status.',
    schema: {
      oneOf: [
        {
          description:
            'Response when the user is active and refresh token is set in cookies.',
          $ref: getSchemaPath(AuthAllResponse),
        },
        {
          description:
            'Response when the user needs verification and refresh token is excluded.',
          $ref: getSchemaPath(AuthRegisterResponse),
        },
      ],
    },
  })
  @Post('login')
  async login(
    @Body()
    dto: LoginUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<void> {
    const loginUser = await this.authService.loginUser(dto, agent);
    if (loginUser.verifyLink === 'active') {
      this.setRefreshCookies(loginUser, res);
    } else {
      delete loginUser.tokens.refreshToken;
      res.status(HttpStatus.OK).json({ ...loginUser });
    }
  }

  @ApiResponse({ status: 200 })
  @Get('logout')
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(),
      path: '/',
    });
    res.sendStatus(HttpStatus.OK);
  }
  @ApiResponse({ status: 201, type: AuthAllResponse })
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @UserAgent()
    agent: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!refreshToken) throw new UnauthorizedException();
    const newTokens = await this.authService.getRefreshTokens(
      refreshToken,
      agent,
    );
    this.setRefreshCookies(newTokens, res);
  }

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

  setRefreshCookies(refreshUser, res) {
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

  @ApiResponse({ status: 200 })
  @Get('check-server')
  async checkServer(): Promise<string> {
    return 'Server is running!';
  }
}
