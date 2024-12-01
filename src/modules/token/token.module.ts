import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'modules/prisma/prisma.service';
import { UsersService } from 'modules/users/users.service';
//     defaultStrategy: 'jwt' — Вказує, що за замовчуванням буде використовуватись стратегія JWT для аутентифікації.
// session: false — Відключає використання сесій, аутентифікація буде відбуватись за допомогою токенів.
// property: 'user' — Вказує, що аутентифікований користувач буде доданий до об'єкта запиту під властивістю user.
//     registerAsync — Дозволяє асинхронне налаштування модуля.
// imports: [ConfigModule] — Імпортує ConfigModule, який забезпечує доступ до конфігураційних параметрів з файлів конфігурації або змінних оточення.
// useFactory — Фабрична функція, яка використовується для налаштування параметрів JWT модуля. Функція приймає ConfigService як параметр і повертає об'єкт з налаштуваннями:
// secret — Секретний ключ для підпису JWT токенів, отримується з конфігурації.
// signOptions — Опції підпису токенів, включаючи час життя токена (expiresIn), також отримується з конфігурації.
// inject: [ConfigService] — Вказує, що ConfigService повинен бути інжектований у фабричну функцію.
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
      property: 'user',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secret_jwt'),
        signOptions: {
          expiresIn: configService.get<string>('expire_jwt'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TokenService,
    JwtService,
    PrismaService,
    UsersService,
    ConfigService,
  ],
  exports: [TokenService],
})
export class TokenModule {}
