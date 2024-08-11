import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthPayload } from 'types/jwt';
import { REQUEST_CONTEXT_KEY } from './constant';

export class RequestContext {
  private readonly _request: Request;

  private readonly _data: AuthPayload | undefined;

  constructor(options: { req: Request; data: any }) {
    this._request = options.req;
    this._data = options.data;
  }

  get req(): Request {
    return this._request;
  }

  get data(): AuthPayload | undefined {
    return this._data;
  }

  static empty() {
    return new RequestContext({ req: {} as Request, data: undefined });
  }

  static fromExecutionContext(
    context: ExecutionContext,
    data?: AuthPayload,
  ): RequestContext {
    const req: Request = context.switchToHttp().getRequest();

    if (req[REQUEST_CONTEXT_KEY]) {
      return req[REQUEST_CONTEXT_KEY];
    } else {
      const newCtx = new RequestContext({ req, data });
      (req as any)[REQUEST_CONTEXT_KEY] = newCtx;

      return newCtx;
    }
  }
}
