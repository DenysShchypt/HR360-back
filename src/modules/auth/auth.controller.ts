import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UserAgent } from '../../../libs/decorators/user-agent.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthUserResponse } from './responses';

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
    // @Res() res: Response,
  ): Promise<void> {
    const tokensAndUser = await this.authService.registerUser(dto, agent);
    return tokensAndUser;
    // res.status(HttpStatus.OK).json({ ...tokensAndUser });
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @UserAgent() agent: string) {
    const loginUser = await this.authService.loginUser(dto, agent);
    return loginUser;
  }
}
