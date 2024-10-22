import { Injectable } from '@nestjs/common'
import { RequestContext } from 'common/request-context'
import { TransactionalConnection } from 'module/connection/connection.service'
import { CreateActivityDTO } from './dto/activity.dto'
import { Activity } from 'common/entities/activity.entity'

@Injectable()
export class ActivityService {
  constructor(private readonly connection: TransactionalConnection) {}

  async create(
    ctx: RequestContext,
    detail: CreateActivityDTO,
    memberId: string
  ) {
    const activityRepo = this.connection.getRepository(ctx, Activity)

    const activity = new Activity({
      comment: detail.comment,
      applicantId: detail.applicantId,
      memberId: memberId
    })

    return await activityRepo.save(activity)
  }
}
