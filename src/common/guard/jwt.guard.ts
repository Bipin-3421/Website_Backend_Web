import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthPayload } from 'types/jwt';
import { RequirePermission } from 'common/decorator/require.decorator';
import { verifyToken } from 'common/utils/jwt.utils';
import { IS_PUBLIC, REQUEST_CONTEXT_KEY } from 'common/constant';
import { RequestContext } from 'common/request-context';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean | undefined>(
      IS_PUBLIC,
      context.getHandler() || context.getClass(),
    );

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (isPublic) {
      return true; // Skip token verification for public routes
    } else if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    let payload: AuthPayload | null;
    try {
      payload = verifyToken<AuthPayload>(
        token,
        this.configService.get('JWT_SECRET', { infer: true }) ?? '',
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const requiredPermissions = this.reflector.get<
      RequirePermission[] | undefined
    >('REQUIRED_PERMISSION_KEY', context.getHandler());

    const userPermission = payload.permission;
    const requestContext = new RequestContext({
      request,
      data: { user: payload },
    });
    (request as any)[REQUEST_CONTEXT_KEY] = requestContext;

    if (requiredPermissions) {
      for (const requiredPermission of requiredPermissions) {
        if (
          requiredPermission.permission.resource === userPermission?.toString()
        ) {
          return true;
        }
      }
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | null {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return null;
    }
    const [bearer, token] = authorizationHeader.split(' ');

    return bearer === 'Bearer' && token ? token : null;
  }
}
