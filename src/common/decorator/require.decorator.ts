import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Permission } from '../../types/permission';
import { REQUIRED_PERMISSION_KEY } from 'common/constant';

export type RequirePermission = {
  permission: Permission;
};

export const Require = (...permission: Permission[]) => {
  const decorator: MethodDecorator[] = [
    SetMetadata(REQUIRED_PERMISSION_KEY, permission),
  ];

  return applyDecorators(...decorator);
};
