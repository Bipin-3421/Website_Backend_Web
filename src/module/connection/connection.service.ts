import { Injectable } from '@nestjs/common'
import { ENTITIY_MANAGER_KEY } from 'common/constant'
import { RequestContext } from 'common/request-context'
import {
  DataSource,
  ObjectLiteral,
  ObjectType,
  Repository,
  EntityManager
} from 'typeorm'

@Injectable()
export class TransactionalConnection {
  constructor(private dataSource: DataSource) {}

  /**
   * Gets the TypeORM repository for the specified entity.
   * If a RequestContext is provided, retrieves the repository from the transactional EntityManager.
   * If no RequestContext is provided, retrieves the repository from the default DataSource.
   * @param ctxOrTarget The RequestContext object or the entity type for which to get the repository.
   * @param maybeTarget The entity type for which to get the repository (required if RequestContext is provided).
   * @returns The TypeORM repository for the specified entity.
   */
  getRepository<Entity extends ObjectLiteral>(
    target: ObjectType<Entity>
  ): Repository<Entity>

  getRepository<Entity extends ObjectLiteral>(
    ctx: RequestContext,
    target: ObjectType<Entity>
  ): Repository<Entity>

  getRepository<Entity extends ObjectLiteral>(
    ctxOrTarget: RequestContext | ObjectType<Entity>,
    maybeTarget?: ObjectType<Entity>
  ): Repository<Entity> {
    if (ctxOrTarget instanceof RequestContext) {
      let entityManager: EntityManager
      entityManager = (ctxOrTarget.req as any)?.[ENTITIY_MANAGER_KEY]

      if (!entityManager || entityManager.queryRunner?.isReleased) {
        entityManager = this.dataSource.manager
      }

      return entityManager.getRepository(maybeTarget!)
    } else {
      return this.dataSource.getRepository(ctxOrTarget)
    }
  }
}
