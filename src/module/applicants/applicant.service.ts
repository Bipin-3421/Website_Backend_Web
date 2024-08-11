import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateApplicantDto } from './dto/create.applicant.dto';
import { AssetService } from 'asset/asset.service';
import { Applicant } from 'common/entities/applicant.entity';
import { ApplicationStatus } from 'common/enum/applicant.status.enum';
import { ApplicantFilterDto } from './dto/applicant.search.dto';
import { PatchApplicantDto } from './dto/patch.applicant.dto';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';

@Injectable()
export class ApplicantService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async create(ctx: RequestContext, applicantDetail: CreateApplicantDto) {
    const asset = await this.assetService.upload(applicantDetail.cv.buffer);

    const applicant = new Applicant({
      name: applicantDetail.name,
      email: applicantDetail.email,
      phoneNumber: applicantDetail.phone,
      address: applicantDetail.address,
      githubURL: applicantDetail.githubUrl,
      portfolioURL: applicantDetail.portfolioUrl,
      cv: asset,
      referalSource: applicantDetail.referalSource,
      workExperience: applicantDetail.workExperience,
      vacancyId: applicantDetail.vacancyId,
      status: ApplicationStatus.INITIAL,
    });

    const applicantRepo = this.connection.getRepository(Applicant);

    return await applicantRepo.save(applicant);
  }

  async delete(id: string): Promise<boolean> {
    const applicantRepo = this.dataSource.getRepository(Applicant);

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
    await this.assetService.delete(applicant.cv.id);

    return true;
  }

  async findMany(queryParams: ApplicantFilterDto) {
    const applicantRepo = this.dataSource.getRepository(Applicant);

    const filteredData = await applicantRepo.findAndCount({
      where: {
        status: queryParams.applicantStatus
          ? queryParams.applicantStatus
          : undefined,
      },
      take: queryParams.take,
      skip: queryParams.page,
    });

    return filteredData;
  }

  async update(id: string, applicantStatus: PatchApplicantDto) {
    const applicantRepo = this.dataSource.getRepository(Applicant);
    const applicant = await applicantRepo.findOne({
      where: { id: id },
    });
    if (!applicant) {
      return false;
    }
    applicant.status = applicantStatus.status;

    return await applicantRepo.save(applicant);
  }
}
