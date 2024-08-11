import { Injectable } from '@nestjs/common';
import { Vacancy } from 'common/entities/vacancy.entity';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyFilterDto } from 'module/vacancies/dto/vacancy.search.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { RequestContext } from 'common/request-context';
import { ILike } from 'typeorm';

@Injectable()
export class VacancyService {
  constructor(private readonly connection: TransactionalConnection) {}

  async create(ctx: RequestContext, jobDetails: CreateVacancyRequestDto) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const vacancy = new Vacancy({
      designation: jobDetails.designation,
      position: jobDetails.position,
      datePosted: jobDetails.datePosted,
      deadline: jobDetails.deadline,
      salary: jobDetails.salary,
      jobType: jobDetails.jobType,
      experience: jobDetails.experience,
      openingPosition: jobDetails.openingPosition,
    });

    return await vacancyRepo.save(vacancy);
  }

  async findMany(ctx: RequestContext, queryParams: VacancyFilterDto) {
    const vacancyRepo = this.connection.getRepository(ctx, Vacancy);

    const filteredData = await vacancyRepo.findAndCount({
      where: {
        designation: queryParams.query
          ? ILike(`%${queryParams.query}%`)
          : undefined,
        jobType: queryParams.jobType ? queryParams.jobType : undefined,
      },
      take: queryParams.take ?? 10,
      skip: (queryParams.page ?? 0) * (queryParams.take ?? 10),
    });

    return filteredData;
  }

  async delete(ctx: RequestContext, id: string) {
    return await this.connection.getRepository(ctx, Vacancy).delete({ id: id });
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
    });

    if (!originalVacancyDetails) {
      return null;
    }

    Object.keys(details).forEach((key) => {
      if (details[key] !== undefined) {
        originalVacancyDetails[key] = details[key];
      }
    });

    return await vacancyRepo.save(originalVacancyDetails);
  }
}
