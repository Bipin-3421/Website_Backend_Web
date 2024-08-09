import { Request } from 'express';

export class RequestContext {
  private readonly _request: Request;

  private readonly _data: any;

  constructor(options: { request: Request; data: any }) {
    this._request = options.request;
    this._data = options.data;
  }

  getRequest(): Request {
    return this._request;
  }

  getData(): any {
    return this._data;
  }
}
