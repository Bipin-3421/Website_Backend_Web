import { Module } from '@nestjs/common'
import { ApplicantController } from './applicant.controller'
import { ApplicantService } from './applicant.service'
import { AssetModule } from 'asset/asset.module'

@Module({
  imports: [AssetModule],
  providers: [ApplicantService],
  controllers: [ApplicantController],
  exports: []
})
export class ApplicantModule {}
