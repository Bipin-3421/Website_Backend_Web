import { Injectable } from '@nestjs/common';
import { DataSource, OneToMany } from 'typeorm';
import { Vacancy } from 'common/entities/vacancy.entity';
import { CreateVacancyReqDto } from './dto/create.vacancy.req.dto';
import { PatchVacancyReqDto } from './dto/patch.vacancy.req.dto';

@Injectable()
export class VacancyService {
  constructor(private readonly dataSource: DataSource) {}

  async createJob(jobDetails: CreateVacancyReqDto) {
    const vacancy = this.dataSource.getRepository(Vacancy).create({
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

  async getAllJob() {
    return await this.dataSource.getRepository(Vacancy).find();
  }

  async deleteJob(id: string) {
    return await this.dataSource.getRepository(Vacancy).delete(id);
  }

  async specificVacancy(id: string) {
    return await this.dataSource.getRepository(Vacancy).findOne({
      where: { id: id },
    });
  }

  async updateVacancyDetails(details: PatchVacancyReqDto, id: string) {
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
