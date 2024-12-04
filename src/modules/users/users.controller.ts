import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { JwtAuthGuard } from 'guards/jwt-guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user-data')
  async getUserData(@CurrentUser('id') id: string) {
    return await this.usersService.getUserData(id);
  }
}
