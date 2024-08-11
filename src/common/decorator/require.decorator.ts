import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionResource } from '../../types/permission';
import { REQUIRED_PERMISSION_KEY } from 'common/constant';

export type RequirePermission = {
  permission: PermissionResource;
  action: PermissionAction;
};

export const Require = (...permission: RequirePermission[]) => {
  const decorator: MethodDecorator[] = [
    SetMetadata(REQUIRED_PERMISSION_KEY, permission),
  ];

  return applyDecorators(...decorator);
};
