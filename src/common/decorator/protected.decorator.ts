import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { IS_PUBLIC } from 'common/constant';

export const Protected = () => {
  return applyDecorators(
    SetMetadata(IS_PUBLIC, false),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
