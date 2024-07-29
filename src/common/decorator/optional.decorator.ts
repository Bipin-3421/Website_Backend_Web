import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { IsOptional, ValidationOptions } from 'class-validator';

export const Optional = (
  optionalValidateOptions?: ValidationOptions,
  ApiPropertyOptionalOptions?: ApiPropertyOptions,
) => {
  return applyDecorators(
    ApiPropertyOptional(ApiPropertyOptionalOptions),
    IsOptional(optionalValidateOptions),
  );
};
