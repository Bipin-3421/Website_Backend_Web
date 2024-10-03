import { Injectable, NotFoundException, Search } from '@nestjs/common';
import { Vacancy } from 'common/entities/vacancy.entity';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyFilterDto } from 'module/vacancies/dto/vacancy.search.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { RequestContext } from 'common/request-context';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { AssetService } from 'asset/asset.service';
import { patchEntity } from 'common/utils/patchEntity';
import { AssetFor } from 'common/enum/asset.for.enum';
import { Designation } from 'common/entities/designation.entity';

@Injectable()
export class VacancyService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async create(ctx: RequestContext, body: CreateVacancyRequestDto) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);
    const designationRepo = this.connection.getRepository(ctx, Designation);

    const designation = await designationRepo.exists({
      where: {
        id: body.designationId,
      },
    });

    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    const asset = await this.assetService.upload(
      ctx,
      body.image.buffer,
      AssetFor.VACANCY,
    );

    const vacancy = new Vacancy({
      name: body.name,
      designationId: body.designationId,
      jobLevel: body.jobLevel,
      salary: body.salary,
      skills: body.skills,
      experience: body.experience,
      jobType: body.jobType,
      datePosted: body.datePosted,
      deadline: body.deadLine,
      vacancyOpening: body.vacancyOpening,
      description: body.description,
      status: body.status,
      image: asset,
    });

    return await vacancyRepo.save(vacancy);
  }

  async findMany(ctx: RequestContext, query: VacancyFilterDto) {
    const {
      search,
      take = 10,
      page = 0,
      designationId,
      status,
      jobLevel,
      datePostedFrom,
      datePostedTo,
      deadlineFrom,
      deadlineTo,
    } = query;

    const skip = take * page;

    const whereClause: FindOptionsWhere<Vacancy> = {
      name: search ? ILike(`%${search}%`) : undefined,

      designationId: designationId ? designationId : undefined,
      status: status ? status : undefined,
      jobLevel: jobLevel ? jobLevel : undefined,

      datePosted:
        datePostedFrom && datePostedTo
          ? Between(new Date(datePostedFrom), new Date(datePostedTo))
          : datePostedFrom
            ? MoreThanOrEqual(new Date(datePostedFrom))
            : datePostedTo
              ? LessThanOrEqual(new Date(datePostedTo))
              : undefined,

      deadline:
        deadlineFrom && deadlineTo
          ? Between(new Date(deadlineFrom), new Date(deadlineTo))
          : deadlineFrom
            ? MoreThanOrEqual(new Date(deadlineFrom))
            : deadlineTo
              ? LessThanOrEqual(new Date(deadlineTo))
              : undefined,
    };

    return this.connection.getRepository(ctx, Vacancy).findAndCount({
      where: whereClause,
      relations: { image: true, designation: true, applicants: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findSingleVacancy(ctx: RequestContext, vacancyId: string) {
    return await this.connection.getRepository(ctx, Vacancy).findOne({
      where: { id: vacancyId },
      relations: { image: true },
    });
  }

  async update(
    ctx: RequestContext,
    details: UpdateVacancyRequestDto,
    VacancyId: string,
  ) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const vacancy = await vacancyRepo.findOne({
      where: { id: VacancyId },
      relations: {
        image: true,
      },
    });
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    const { image, ...patch } = details;
    patchEntity(vacancy, patch);

    let oldAssetId: string | undefined;

    if (image) {
      const asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.VACANCY,
      );

      oldAssetId = vacancy.imageId;

      vacancy.imageId = asset.id;
    }

    await vacancyRepo.save(vacancy);

    if (oldAssetId) {
      await this.assetService.delete(ctx, oldAssetId);
    }
    return vacancy;
  }

  async delete(ctx: RequestContext, vacancyId: string) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const vacancy = await vacancyRepo.findOne({
      where: { id: vacancyId },
      relations: {
        image: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    await vacancyRepo.remove(vacancy);
    await this.assetService.delete(ctx, vacancy.image.id);
  }
}
