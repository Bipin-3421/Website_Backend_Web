import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { IS_PROTECTED } from 'common/constant';

export const Protected = () => {
  return applyDecorators(
    SetMetadata(IS_PROTECTED, true),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
