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
import { IS_PUBLIC, REQUIRED_PERMISSION_KEY } from 'common/constant';
import { RequestContext } from 'common/request-context';
import { AppConfig } from '../../config/configuration';
import { PermissionResource, roleToPermissionArray } from 'types/permission';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const { isPublic, requiredPermissions } = this.getHandlerInfo(context);

    const token = this.extractTokenFromRequest(request);

    const payload: AuthPayload | null = token
      ? verifyToken<AuthPayload>(
          token,
          this.configService.get('jwt.jwtSecret', { infer: true }) ?? '',
        )
      : null;

    const ctx = RequestContext.fromExecutionContext(
      context,
      payload ?? undefined,
    );

    if (isPublic) {
      return true;
    } else if (!ctx.data) {
      throw new UnauthorizedException('Token not found');
    }

    const userPermission = roleToPermissionArray[ctx.data.role];

    if (requiredPermissions) {
      for (const requiredPermission of requiredPermissions) {
        const foundPermission = userPermission.find((permission) => {
          if (
            permission.resource === PermissionResource.ALL ||
            (permission.resource === requiredPermission.permission &&
              permission.action.includes(requiredPermission.action))
          ) {
            return true;
          }
        });

        if (foundPermission === undefined) {
          return false;
        }
      }
    }

    return true;
  }

  private getHandlerInfo(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean | undefined>(
      IS_PUBLIC,
      context.getHandler() || context.getClass(),
    );
    const requiredPermissions = this.reflector.get<
      RequirePermission[] | undefined
    >(REQUIRED_PERMISSION_KEY, context.getHandler());

    return {
      isPublic,
      requiredPermissions,
    };
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
