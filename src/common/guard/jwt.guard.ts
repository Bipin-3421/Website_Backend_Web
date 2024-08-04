import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { verifyToken } from 'common/utils/jwt.utils';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'common/dto/jwt.payload';
import { IS_PUBLIC } from 'common/constant';

@Injectable()
export class JwtServiceImpl implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.get<boolean | undefined>(
      IS_PUBLIC,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = verifyToken<JwtPayload>(
        token,
        this.configService.get('JWT_SECRET', {
          infer: true,
        }) ?? '',
      );
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
