import { Injectable, NotFoundException, Search } from '@nestjs/common';
import { Vacancy } from 'common/entities/vacancy.entity';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyFilterDto } from 'module/vacancies/dto/vacancy.search.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { RequestContext } from 'common/request-context';
import { ILike } from 'typeorm';
import { AssetService } from 'asset/asset.service';
import { patchEntity } from 'common/utils/patchEntity';
import { AssetFor } from 'common/enum/asset.for.enum';
import { Designation } from 'common/entities/designation.entity';
import { dateFilter } from 'common/utils/dateFilter';

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

  async findMany(ctx: RequestContext, filter: VacancyFilterDto) {
    const { take = 10, page = 0 } = filter;

    const skip = take * page;

    return this.connection.getRepository(ctx, Vacancy).findAndCount({
      where: {
        name: filter.search ? ILike(`%${filter.search}%`) : undefined,
        designationId: filter.designationId,
        status: filter.status,
        jobLevel: filter.jobLevel,
        datePosted: dateFilter(filter.datePostedFrom, filter.datePostedTo),
        deadline: dateFilter(filter.deadlineFrom, filter.deadlineTo),
      },
      relations: { image: true, designation: true },
      loadRelationIds: { relations: ['applicants'] },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  findSingleVacancy(ctx: RequestContext, vacancyId: string) {
    return this.connection.getRepository(ctx, Vacancy).findOne({
      where: { id: vacancyId },
      relations: { image: true },
    });
  }

  async update(
    ctx: RequestContext,
    details: UpdateVacancyRequestDto,
    vacancyId: string,
  ) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const vacancy = await vacancyRepo.findOne({
      where: { id: vacancyId },
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
