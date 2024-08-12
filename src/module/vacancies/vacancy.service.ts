import { Injectable } from '@nestjs/common';
import { Vacancy } from 'common/entities/vacancy.entity';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyFilterDto } from 'module/vacancies/dto/vacancy.search.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { RequestContext } from 'common/request-context';
import { ILike } from 'typeorm';
import { AssetService } from 'asset/asset.service';
import { JobStatus } from 'common/enum/job.status.enum';
import { Asset } from '../../common/entities/asset.entity';
import { patchEntity } from 'common/utils/patchEntity';
import { AssetFor } from 'common/enum/asset.for.enum';
import { dateFilter } from 'common/utils/dateFilter';

@Injectable()
export class VacancyService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async create(ctx: RequestContext, jobDetails: CreateVacancyRequestDto) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const asset = await this.assetService.upload(
      ctx,
      jobDetails.image.buffer,
      AssetFor.VACANCY,
    );

    const vacancy = new Vacancy({
      designation: jobDetails.designation,
      position: jobDetails.position,
      datePosted: jobDetails.datePosted,
      deadline: jobDetails.deadLine,
      jobType: jobDetails.jobType,
      experience: jobDetails.experience,
      openingPosition: jobDetails.openingPosition,
      description: jobDetails.description,
      skill: jobDetails.skill,
      department: jobDetails.department,
      status: JobStatus.ACTIVE,
      image: asset,
    });

    return await vacancyRepo.save(vacancy);
  }

  async findMany(ctx: RequestContext, queryParams: VacancyFilterDto) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const filteredData = await vacancyRepo.findAndCount({
      where: {
        designation: queryParams.designation
          ? ILike(`%${queryParams.designation}%`)
          : undefined,
        jobType: queryParams.jobType,
        position: queryParams.position
          ? ILike(`%${queryParams.position}%`)
          : undefined,
        status: queryParams.status,
        datePosted: dateFilter(
          queryParams.datePostedFrom,
          queryParams.datePostedTo,
        ),
        deadline: dateFilter(queryParams.deadLineFrom, queryParams.deadLineTo),
        openingPosition: queryParams.openingPosition
          ? queryParams.openingPosition
          : undefined,
        experience: queryParams.experience ? queryParams.experience : undefined,
      },
      take: queryParams.take ?? 10,
      skip: (queryParams.page ?? 0) * (queryParams.take ?? 10),
    });

    return filteredData;
  }

  async delete(ctx: RequestContext, id: string) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const vacancy = await vacancyRepo.findOne({
      where: { id: id },
      relations: {
        image: true,
      },
    });

    if (!vacancy) {
      return false;
    }

    await vacancyRepo.remove(vacancy);
    await this.assetService.delete(ctx, vacancy.image.id);

    return true;
  }

  async getVacancy(ctx: RequestContext, id: string) {
    return await this.connection.getRepository(ctx, Vacancy).findOne({
      where: { id: id },
    });
  }

  async update(
    ctx: RequestContext,
    details: UpdateVacancyRequestDto,
    id: string,
  ) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const originalVacancyDetails = await vacancyRepo.findOne({
      where: { id: id },
      relations: {
        image: true,
      },
    });
    if (!originalVacancyDetails) {
      return null;
    }

    const { image, ...patch } = details;

    patchEntity(originalVacancyDetails, patch);

    let asset: Asset | undefined;

    if (image) {
      asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.VACANCY,
      );

      originalVacancyDetails.image = asset ?? originalVacancyDetails.image;
      originalVacancyDetails.updatedAt = new Date();
    }

    return await vacancyRepo.save(originalVacancyDetails);
  }
}
