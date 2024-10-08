import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { TransactionInterceptor } from 'module/connection/transaction.interceptor'

export const Transaction = () => {
  return applyDecorators(UseInterceptors(TransactionInterceptor))
}
