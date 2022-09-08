import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import User from '../user/user-type';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;

    return req.user;
  },
);
