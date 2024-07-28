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
import { VacancyFilterDto } from 'common/dto/vacancy.search.dto';
import { takePagination } from 'common/utils/pagination.utils';

@Controller('vacancy')
@ApiTags('Job Vacancy API')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @PublicRoute()
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
      data: res.id,
    } as MessageResponseWithIdDto;
  }

  @Get()
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getAllJobVacancy(
    @Query() queryFilter: VacancyFilterDto,
  ): Promise<ListVacanciesReponseDto> {
    const [response, count] = await this.vacancyService.findMany(queryFilter);
    return {
      message: 'All job fetched successfully',
      data: response,
      Pagination: takePagination(
        queryFilter.page ?? 0,
        queryFilter.take ?? 0,
        count,
      ),
    };
  }

  @Delete()
  @ApiBadRequestResponse({
    description: 'Job vacancy deletion failed',
  })
  async deleteJobVacancy(
    @Param(':vacancyId')
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
      data: updatedVacancy.id,
    } as MessageResponseWithIdDto;
  }
}
