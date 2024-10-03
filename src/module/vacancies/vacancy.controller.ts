import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateVacancyRequestDto } from './dto/create.vacancy.dto';
import { UpdateVacancyRequestDto } from './dto/update.vacancy.dto';
import { VacancyIdDTO } from './dto/param.dto';
import {
  GetVacancyResponseDto,
  ListVacanciesReponseDto,
} from './dto/get.vacancy.dto';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { VacancyFilterDto } from 'module/vacancies/dto/vacancy.search.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';
import { fileUpload } from 'common/file-upload.interceptor';

@Controller('vacancy')
@ApiTags('Vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.EDIT,
  })
  @UseInterceptors(fileUpload('image'))
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  @ApiConsumes('multipart/form-data')
  async createJobVacancy(
    @Ctx() ctx: RequestContext,
    @Body() vacancyDetails: CreateVacancyRequestDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('Vacancy image is required');
    }

    vacancyDetails.image = file;

    const res = await this.vacancyService.create(ctx, vacancyDetails);

    return {
      message: 'Vacancy created successfully',
      data: {
        id: res.id,
      },
    };
  }

  @Get()
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getAllJobVacancy(
    @Ctx() ctx: RequestContext,
    @Query() queryFilter: VacancyFilterDto,
  ): Promise<ListVacanciesReponseDto> {
    const [vacancies, total] = await this.vacancyService.findMany(
      ctx,
      queryFilter,
    );

    return {
      message: 'All job fetched successfully',
      data: vacancies.map((vacancy) => {
        return {
          id: vacancy.id,
          name: vacancy.name,
          createdAt: vacancy.createdAt,
          designation: {
            id: vacancy.designation.id,
            name: vacancy.designation.name,
          },
          jobLevel: vacancy.jobLevel,
          salary: vacancy.salary,
          skills: vacancy.skills,
          experience: vacancy.experience,
          jobType: vacancy.jobType,
          datePosted: vacancy.datePosted,
          deadline: vacancy.deadline,
          vacancy: vacancy.vacancyOpening,
          status: vacancy.status,
          description: vacancy.description,
          image: {
            id: vacancy.image.id,
            name: vacancy.image.name,
            url: vacancy.image.url,
          },
          applicant: vacancy.applicants.length,
        };
      }),
      Pagination: getPaginationResponse(vacancies, total, queryFilter),
    };
  }

  @Get(':vacancyId')
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async findSingleVacancy(
    @Ctx() ctx: RequestContext,
    @Param() param: VacancyIdDTO,
  ): Promise<GetVacancyResponseDto> {
    const vacancy = await this.vacancyService.findSingleVacancy(
      ctx,
      param.vacancyId,
    );

    if (!vacancy) {
      throw new NotFoundException(`Vacancy  not found`);
    }

    return {
      message: 'Vacancy fetched successfully',
      data: {
        id: vacancy.id,
        name: vacancy.name,
        createdAt: vacancy.createdAt,
        designationId: vacancy.designationId,
        jobLevel: vacancy.jobLevel,
        salary: vacancy.salary,
        skills: vacancy.skills,
        experience: vacancy.experience,
        jobType: vacancy.jobType,
        datePosted: vacancy.datePosted,
        deadline: vacancy.deadline,
        vacancy: vacancy.vacancyOpening,
        status: vacancy.status,
        description: vacancy.description,
        image: {
          id: vacancy.image.id,
          name: vacancy.image.name,
          url: vacancy.image.url,
        },
      },
    };
  }

  @Patch(':vacancyId')
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.EDIT,
  })
  @UseInterceptors(fileUpload('image'))
  @ApiBadRequestResponse({
    description: 'Job vacancy update failed',
  })
  @ApiConsumes('multipart/form-data')
  async updateJobVacancy(
    @Ctx() ctx: RequestContext,
    @Param() param: VacancyIdDTO,
    @Body() body: UpdateVacancyRequestDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('CV is required');
    }
    body.image = file;

    const updatedVacancy = await this.vacancyService.update(
      ctx,
      body,
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

  @Delete(':vacancyId')
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Job vacancy deletion failed',
  })
  async deleteJobVacancy(
    @Ctx() ctx: RequestContext,
    @Param() param: VacancyIdDTO,
  ): Promise<MessageResponseDTO> {
    await this.vacancyService.delete(ctx, param.vacancyId);

    return {
      message: 'Vacancy deleted successfully',
    };
  }
}
