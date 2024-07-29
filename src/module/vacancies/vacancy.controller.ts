import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { PublicRoute } from 'common/decorator/public.decorator';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyIdDto } from './dto/param.dto';
import {
  GetVacancyResponseDto,
  ListVacanciesReponseDto,
} from './dto/get.vacancy.dto';
import {
  MessageResponseDto,
  MessageResponseWithIdDto,
} from 'common/dto/response.dto';
import { VacancyFilterDto } from 'module/vacancies/dto/vacancy.search.dto';
import { takePagination } from 'common/utils/pagination.utils';
import { PaginationDto } from 'common/dto/pagination.dto';

@Controller('vacancy')
@ApiTags('Job Vacancy API')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  async createJobVacancy(
    @Body()
    vacancyDetails: CreateVacancyRequestDto,
  ): Promise<MessageResponseWithIdDto> {
    const res = await this.vacancyService.create(vacancyDetails);

    return {
      message: 'Vacancy created successfully',
      data: {
        id: res.id,
      },
    };
  }

  @Get()
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getAllJobVacancy(
    @Query() queryFilter: VacancyFilterDto,
  ): Promise<ListVacanciesReponseDto> {
    const [response, total] = await this.vacancyService.findMany(queryFilter);
    const filterResponse = new PaginationDto();
    filterResponse.page = queryFilter.page;
    filterResponse.take = queryFilter.take;
    return {
      message: 'All job fetched successfully',
      data: response,
      Pagination: takePagination(response, filterResponse, total),
    };
  }

  @Delete(':vacancyId')
  @ApiBadRequestResponse({
    description: 'Job vacancy deletion failed',
  })
  async deleteJobVacancy(
    @Param()
    param: VacancyIdDto,
  ): Promise<MessageResponseDto> {
    await this.vacancyService.delete(param.vacancyId);
    return {
      message: 'Job deleted successfully',
    };
  }

  @Get(':vacancyId')
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getJobVacancyById(
    @Param()
    param: VacancyIdDto,
  ): Promise<GetVacancyResponseDto> {
    const res = await this.vacancyService.getVacancy(param.vacancyId);

    if (!res) {
      throw new NotFoundException(
        `Vacancy with ID ${param.vacancyId} not found`,
      );
    }

    return {
      message: 'Specific job fetched successfully',
      data: res,
    };
  }

  @Patch(':vacancyId')
  @ApiBadRequestResponse({
    description: 'Job vacancy update failed',
  })
  async updateJobVacancy(
    @Param() param: VacancyIdDto,
    @Body() vacancyDetails: UpdateVacancyRequestDto,
  ): Promise<MessageResponseWithIdDto> {
    const updatedVacancy = await this.vacancyService.update(
      vacancyDetails,
      param.vacancyId,
    );

    if (!updatedVacancy) {
      throw new NotFoundException(
        `Vacancy with ID ${param.vacancyId} not found`,
      );
    }
    return {
      message: 'Job updated successfully',
      data: {
        id: updatedVacancy.id,
      },
    };
  }
}
