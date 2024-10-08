import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { ENTITIY_MANAGER_KEY } from 'common/constant'
import { catchError, concatMap, Observable } from 'rxjs'
import { DataSource } from 'typeorm'

export class TransactionInterceptor implements NestInterceptor {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    req[ENTITIY_MANAGER_KEY] = queryRunner.manager

    return next.handle().pipe(
      concatMap(async (response) => {
        await queryRunner.commitTransaction()

        return response
      }),
      catchError(async (error) => {
        await queryRunner.rollbackTransaction()
        throw error
      })
    )
  }
}
