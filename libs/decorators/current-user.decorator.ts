import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'interfaces/user';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | Partial<IUser> => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    return data ? user?.[data] : user;
  },
);
