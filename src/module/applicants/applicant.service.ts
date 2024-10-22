import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateApplicantDto } from './dto/create.applicant.dto'
import { AssetService } from 'asset/asset.service'
import { Applicant } from 'common/entities/applicant.entity'
import { ApplicationStatus } from 'common/enum/applicant.status.enum'
import { ApplicantFilterDto } from './dto/applicant.search.dto'
import { PatchApplicantDto } from './dto/patch.applicant.dto'
import { RequestContext } from 'common/request-context'
import { TransactionalConnection } from 'module/connection/connection.service'
import { AssetFor } from 'common/enum/asset.for.enum'
import { ILike } from 'typeorm'
import { EntityDiff, patchEntity } from 'common/utils/patchEntity'
import { Member } from 'common/entities/member.entity'
import { Activity } from 'common/entities/activity.entity'

@Injectable()
export class ApplicantService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService
  ) {}

  async create(ctx: RequestContext, applicantDetail: CreateApplicantDto) {
    const asset = await this.assetService.upload(
      ctx,
      applicantDetail.cv.buffer,
      AssetFor.CV
    )

    const applicant = new Applicant({
      name: applicantDetail.name,
      email: applicantDetail.email,
      phoneNumber: applicantDetail.phone,
      address: applicantDetail.address,
      githubUrl: applicantDetail.githubUrl,
      designationId: applicantDetail.designationId,
      portfolioUrl: applicantDetail.portfolioUrl,
      cv: asset,
      referralSource: applicantDetail.referralSource,
      workExperience: applicantDetail.workExperience,
      vacancyId: applicantDetail.vacancyId,
      position: applicantDetail.position,
      status: ApplicationStatus.PROCESSING
    })

    const applicantRepo = this.connection.getRepository(ctx, Applicant)

    return await applicantRepo.save(applicant)
  }

  async findMany(ctx: RequestContext, queryParams: ApplicantFilterDto) {
    const applicantRepo = this.connection.getRepository(ctx, Applicant)

    const filteredData = await applicantRepo.findAndCount({
      where: {
        status: queryParams.applicantStatus
          ? queryParams.applicantStatus
          : undefined,
        name: queryParams.name ? ILike(`%${queryParams.name}%`) : undefined,
        email: queryParams.email ? ILike(`%${queryParams.email}%`) : undefined,
        phoneNumber: queryParams.phone
          ? ILike(`%${queryParams.phone}%`)
          : undefined,
        address: queryParams.address
          ? ILike(`%${queryParams.address}%`)
          : undefined,
        vacancy: {
          designation: queryParams.designation
            ? ILike(`%${queryParams.designation}%`)
            : undefined
        }
      },
      relations: {
        vacancy: true,
        cv: true,
        designation: true
      },
      take: queryParams.take,
      skip: queryParams.page
    })

    return filteredData
  }

  async findSingleAplicant(ctx: RequestContext, applicantId: string) {
    const applicantRepo = this.connection.getRepository(ctx, Applicant)
    const applicant = await applicantRepo.findOne({
      where: {
        id: applicantId
      },
      relations: { activity: { member: { image: true } } }
    })

    if (!applicant) {
      throw new NotFoundException('Applicant not found')
    }
    // Format the activity into history and comments
    const allActivities = applicant.activity.map((activity) => {
      if (activity.comment) {
        return {
          type: 'comment',
          message: activity.comment,
          createdAt: activity.createdAt,
          memberName: activity.member?.name || 'Unknown'
        }
      }

      return {
        type: 'history',
        message: activity.history,
        createdAt: activity.createdAt,
        memberName: activity.member?.name || 'Unknown'
      }
    })

    return {
      ...applicant,
      all: allActivities
    }
  }

  async update(
    ctx: RequestContext,
    applicantId: string,
    applicantStatus: PatchApplicantDto
  ) {
    const applicantRepo = this.connection.getRepository(ctx, Applicant)
    const applicant = await applicantRepo.findOne({
      where: { id: applicantId },
      relations: ['activity']
    })
    if (!applicant) {
      throw new NotFoundException('Applicant not found')
    }

    // Capture the current state before patching
    const changes: EntityDiff[] = patchEntity(applicant, applicantStatus)

    // Save the updated applicant
    await applicantRepo.save(applicant)

    const memberRepo = this.connection.getRepository(ctx, Member)
    const activityRepo = this.connection.getRepository(ctx, Activity)
    // Log changes and comments in the Activity entity
    const member = await memberRepo.findOne({
      where: { id: ctx.data?.memberId }
    })
    if (member) {
      // Log field changes as history
      for (const change of changes) {
        const activity = activityRepo.create({
          applicantId: applicant.id,
          history: `Changed ${change.key} from ${change.from} to ${change.to}`, // Log history here
          member: member
        })
        await activityRepo.save(activity)
      }

      // If a comment is provided, log it
      if (applicantStatus.comment) {
        const commentActivity = activityRepo.create({
          applicantId: applicant.id,
          comment: applicantStatus.comment, // Log the comment provided by the member
          member: member
        })
        await activityRepo.save(commentActivity)
      }
    }

    return applicant
  }

  async delete(ctx: RequestContext, id: string): Promise<boolean> {
    const applicantRepo = this.connection.getRepository(ctx, Applicant)

    const applicant = await applicantRepo.findOne({
      where: { id: id },
      relations: {
        cv: true
      }
    })

    if (!applicant) {
      return false
    }

    await applicantRepo.remove(applicant)
    await this.assetService.delete(ctx, applicant.cv.id)

    return true
  }
}
