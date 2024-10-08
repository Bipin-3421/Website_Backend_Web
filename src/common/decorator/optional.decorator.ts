import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { IsOptional, ValidationOptions } from 'class-validator';

export const Optional = (
  optionalValidateOptions?: ValidationOptions,
  apiPropertyOptionalOptions?: ApiPropertyOptions,
) => {
  return applyDecorators(
    ApiPropertyOptional(apiPropertyOptionalOptions),
    IsOptional(optionalValidateOptions),
  );
};
