import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        await this.$connect();
        console.log('Database connected successfully');
        break;
      } catch (error) {
        console.error('Database connection failed. Retrying...', error);
        retries -= 1;
        if (retries === 0) {
          throw new Error('Could not connect to the database');
        }
        await new Promise((res) => setTimeout(res, 5000)); // Retry after 5 seconds
      }
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
