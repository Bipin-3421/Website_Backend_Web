import { Injectable } from '@nestjs/common';
import { CreateApplicantDto } from './dto/create.applicant.dto';
import { AssetService } from 'asset/asset.service';
import { Applicant } from 'common/entities/applicant.entity';
import { ApplicationStatus } from 'common/enum/applicant.status.enum';
import { ApplicantFilterDto } from './dto/applicant.search.dto';
import { PatchApplicantDto } from './dto/patch.applicant.dto';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';
import { AssetFor } from 'common/enum/asset.for.enum';
import { ILike } from 'typeorm';

@Injectable()
export class ApplicantService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async create(ctx: RequestContext, applicantDetail: CreateApplicantDto) {
    const asset = await this.assetService.upload(
      ctx,
      applicantDetail.cv.buffer,
      AssetFor.CV,
    );

    const applicant = new Applicant({
      name: applicantDetail.name,
      email: applicantDetail.email,
      phoneNumber: applicantDetail.phone,
      address: applicantDetail.address,
      githubUrl: applicantDetail.githubUrl,
      portfolioUrl: applicantDetail.portfolioUrl,
      cv: asset,
      referralSource: applicantDetail.referralSource,
      workExperience: applicantDetail.workExperience,
      vacancyId: applicantDetail.vacancyId,
      status: ApplicationStatus.INITIAL,
    });

    const applicantRepo = this.connection.getRepository(ctx, Applicant);

    return await applicantRepo.save(applicant);
  }

  async findMany(ctx: RequestContext, queryParams: ApplicantFilterDto) {
    const applicantRepo = this.connection.getRepository(ctx, Applicant);

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
            : undefined,
        },
      },
      relations: {
        vacancy: true,
        cv: true,
      },
      take: queryParams.take,
      skip: queryParams.page,
    });

    return filteredData;
  }

  async findSingleAplicant(ctx: RequestContext, applicantId: string) {
    const applicantRepo = this.connection.getRepository(ctx, Applicant);
    const applicant = await applicantRepo.findOne({
      where: {
        id: applicantId,
      },
    });
    
return applicant;
  }

  async update(
    ctx: RequestContext,
    id: string,
    applicantStatus: PatchApplicantDto,
  ) {
    const applicantRepo = this.connection.getRepository(ctx, Applicant);
    const applicant = await applicantRepo.findOne({
      where: { id: id },
    });
    if (!applicant) {
      return false;
    }
    applicant.status = applicantStatus.status;

    return await applicantRepo.save(applicant);
  }

  async delete(ctx: RequestContext, id: string): Promise<boolean> {
    const applicantRepo = this.connection.getRepository(ctx, Applicant);

    const applicant = await applicantRepo.findOne({
      where: { id: id },
      relations: {
        cv: true,
      },
    });

    if (!applicant) {
      return false;
    }

    await applicantRepo.remove(applicant);
    await this.assetService.delete(ctx, applicant.cv.id);

    return true;
  }
}
