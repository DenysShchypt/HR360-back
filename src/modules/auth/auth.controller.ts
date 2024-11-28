import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { UserAgent } from '../../../libs/decorators/user-agent.decorator';

@ApiTags('API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokensAndUser = await this.authService.registerUsers(dto, agent);
  }
}
