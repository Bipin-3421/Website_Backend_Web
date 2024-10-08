import { HttpException, Type, applyDecorators } from '@nestjs/common'
import { ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger'
import { getTypeIsArrayTuple } from '@nestjs/swagger/dist/decorators/helpers'
import {
  ResponseObject,
  SchemaObject
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export type Func = () => void

export interface ApiExceptionOptions
  extends Omit<ResponseObject, 'description'> {
  exception: Type<HttpException>
  description?: string
  type?: Func | [Func]
  isArray?: boolean
  schema?: SchemaObject
}

// https://github.com/nestjs/swagger/issues/870#issue-665730548
export const Throws = (
  ...args: (Type<HttpException> | ApiExceptionOptions)[]
): MethodDecorator & ClassDecorator => {
  const decorators: MethodDecorator[] = []

  for (const arg of args) {
    const exception = typeof arg === 'function' ? arg : arg.exception
    const options =
      typeof arg === 'function' ? ({} as ApiExceptionOptions) : arg

    const instance = new exception()

    const schema = options.schema ||
      (exception as any).schema || { type: 'string' }

    const apiResponseOptions: ApiResponseOptions = {
      status: instance.getStatus(),
      description: options?.description || instance.message,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: instance.getStatus()
          },
          message: schema,
          error: {
            type: 'string',
            example: instance.message
          }
        },
        required: ['statusCode', 'message']
      }
    }

    if (options.type) {
      const [type, isArray] = getTypeIsArrayTuple(
        options.type,
        !!options.isArray
      )
      apiResponseOptions.schema.properties!.message = {
        $ref: getSchemaPath(type!())
      }

      if (isArray) {
        apiResponseOptions.schema.properties!.message = {
          type: 'array',
          items: {
            type: 'object',
            $ref: apiResponseOptions.schema.properties!.message['$ref']
          }
        }
      }
    }

    decorators.push(ApiResponse(apiResponseOptions))
  }

  return applyDecorators(...decorators)
}
