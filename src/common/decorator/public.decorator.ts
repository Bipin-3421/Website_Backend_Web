import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { IS_PUBLIC } from 'common/constant';

export const PublicRoute = () => {
  return applyDecorators(
    SetMetadata(IS_PUBLIC, true),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
