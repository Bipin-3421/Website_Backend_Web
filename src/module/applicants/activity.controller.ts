import { Controller, Post, Body } from '@nestjs/common'
import { ActivityService } from './activity.service'
import { Ctx } from 'common/decorator/ctx.decorator'
import { RequestContext } from 'common/request-context'
import { CreateActivityDTO } from './dto/activity.dto'
import { ApiTags } from '@nestjs/swagger'
import { Require } from 'common/decorator/require.decorator'
import { PermissionAction, PermissionResource } from 'types/permission'

@Controller('activity')
@ApiTags('Activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @Require({
    permission: PermissionResource.ALL,
    action: PermissionAction.EDIT
  })
  async createActivity(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateActivityDTO
  ) {
    const memberId = ctx.data?.memberId
    const activity = await this.activityService.create(
      ctx,
      body,
      String(memberId)
    )

    return {
      data: activity.id
    }
  }
}
