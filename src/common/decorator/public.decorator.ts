import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtServiceImpl } from 'common/guard/jwt.guard';

export const IS_PUBLIC = 'isPublic';

export const PublicRoute = () => {
  return applyDecorators(
    SetMetadata(IS_PUBLIC, true),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
