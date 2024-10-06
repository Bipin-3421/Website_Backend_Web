import {
  HttpException,
  ValidationError as ClassValidatorError,
  HttpStatus,
} from '@nestjs/common';

export class ValidationException extends HttpException {
  static schema = {
    type: 'object',
    additionalProperties: { type: 'array', items: { type: 'string' } },
  };

  constructor(errors?: ClassValidatorError[]) {
    const formattedError: { [key: string]: string[] } = {};

    function flatten(err: ClassValidatorError, key = '') {
      const path = key + err.property;
      if (err.constraints) {
        if (!formattedError[path]) formattedError[path] = [];
        formattedError[path].push(...Object.values(err.constraints));
      } else if (err.children) {
        for (let j = 0; j < err.children.length; j++)
          flatten(err.children[j], path + '.');
      }
    }

    if (errors) {
      for (let i = 0; i < errors.length || 0; i++) {
        flatten(errors[i]);
      }
    }

    super(
      {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: formattedError,
        error: 'Validation Error',
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
