import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { Vacancy } from 'common/entities/vacancy.entity';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyFilterDto } from 'common/dto/vacancy.search.dto';
import { JobType } from 'common/enum/Job.type.enum';

@Injectable()
export class VacancyService {
  constructor(private readonly dataSource: DataSource) {}

  async create(jobDetails: CreateVacancyRequestDto) {
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

    return await this.dataSource.getRepository(Vacancy).save(vacancy);
  }

  async findMany(queryParams: VacancyFilterDto) {
    const vacancyRepo = this.dataSource.getRepository(Vacancy);

    const filteredData = vacancyRepo.findAndCount({
      where: {
        designation: queryParams.designation
          ? ILike(`%${queryParams.designation}%`)
          : undefined,
        jobType: queryParams.jobType ? queryParams.jobType : undefined,
      },
      take: queryParams.take ?? 10,
      skip: (queryParams.page ?? 0) * (queryParams.take ?? 10),
    });

    return filteredData;
  }

  async delete(id: string) {
    return await this.dataSource.getRepository(Vacancy).delete(id);
  }

  async getVacancy(id: string) {
    return await this.dataSource.getRepository(Vacancy).findOne({
      where: { id: id },
    });
  }

  async update(details: UpdateVacancyRequestDto, id: string) {
    const vacancyRepository = this.dataSource.getRepository(Vacancy);

    const originalVacancyDetails = await vacancyRepository.findOne({
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

    return await vacancyRepository.save(originalVacancyDetails);
  }
}
