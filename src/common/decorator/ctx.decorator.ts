import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_CONTEXT_KEY } from 'common/constant';
import { RequestContext } from 'common/request-context';

export const Ctx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();

    const reqCtx: RequestContext = request[REQUEST_CONTEXT_KEY];

    return reqCtx;
  },
);
