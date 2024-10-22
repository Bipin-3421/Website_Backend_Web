import { Module } from '@nestjs/common'
import { ApplicantController } from './applicant.controller'
import { ApplicantService } from './applicant.service'
import { AssetModule } from 'asset/asset.module'
import { ActivityService } from './activity.service'
import { ActivityController } from './activity.controller'

@Module({
  imports: [AssetModule],
  providers: [ApplicantService, ActivityService],
  controllers: [ApplicantController, ActivityController],
  exports: []
})
export class ApplicantModule {}
