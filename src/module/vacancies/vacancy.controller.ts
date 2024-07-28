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
import { CreateVacancyResDto } from './dto/create.vacancy.res.dto';
import { CreateVacancyReqDto } from './dto/create.vacancy.req.dto';
import { PublicRoute } from 'common/decorator/public.decorator';
import { GetVacancyDto } from './dto/get.vacancy.dto';
import { ApiBadRequestResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { DeleteVacancyResDto } from './dto/delete.vacancy.res.dto';
import { GetSpecificVacancyResDto } from './dto/get.vacancy.specific.res.dto';
import { PatchVacancyReqDto } from './dto/patch.vacancy.req.dto';
import { ParamDto } from './dto/param.dto';

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
    vacancyDetails: CreateVacancyReqDto,
  ): Promise<CreateVacancyResDto> {
    const res = await this.vacancyService.createJob(vacancyDetails);

    return {
      message: 'Vacancy created successfully',
      status: 'success',
      data: res.id,
    };
  }

  @Get()
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getAllJobVacancy(): Promise<GetVacancyDto> {
    const res = await this.vacancyService.getAllJob();
    return {
      message: 'All job fetched successfully',
      data: res,
    };
  }

  @Delete()
  @ApiBadRequestResponse({
    description: 'Job vacancy deletion failed',
  })
  async deleteJobVacancy(
    @Query()
    param: ParamDto,
  ): Promise<DeleteVacancyResDto> {
    await this.vacancyService.deleteJob(param.vacancyId);
    return {
      message: 'Job deleted successfully',
      data: 'deleted specific vacancy',
    };
  }

  @Get(':id')
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getJobVacancyById(
    @Param()
    param: ParamDto,
  ): Promise<GetSpecificVacancyResDto> {
    const res = await this.vacancyService.specificVacancy(param.vacancyId);
    return {
      message: 'Specific job fetched successfully',
      data: res,
    };
  }

  @Patch(':id')
  @ApiBadRequestResponse({
    description: 'Job vacancy update failed',
  })
  async updateJobVacancy(
    @Param() param: ParamDto,
    @Body() vacancyDetails: PatchVacancyReqDto,
  ): Promise<GetSpecificVacancyResDto> {
    const updatedVacancy = await this.vacancyService.updateVacancyDetails(
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
      data: updatedVacancy,
    };
  }
}
