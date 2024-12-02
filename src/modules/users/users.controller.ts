import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'guards/jwt-guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {}
