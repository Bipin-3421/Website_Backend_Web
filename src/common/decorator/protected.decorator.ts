import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

export const IS_PROTECT = 'isPublic';
export const Protected = () => {
  return applyDecorators(
    SetMetadata(IS_PROTECT, true),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
