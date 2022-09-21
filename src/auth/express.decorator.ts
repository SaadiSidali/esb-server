import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import User from '../user/user-type';

export const GetReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;

    return req;
  },
);

export const GetRes = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const res = GqlExecutionContext.create(ctx).getContext().req.res;

    return res;
  },
);
