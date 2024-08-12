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
import { PublicRoute } from 'common/decorator/public.decorator';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
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
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import { FileInterceptor } from '@nestjs/platform-express';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';

@Controller('vacancy')
@ApiTags('Job Vacancy API')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.EDIT,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(req, file, callback) {
        const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!MIME_TYPES.includes(file.mimetype)) {
          callback(
            new NotAcceptableException('WEBP,SVG,JPG,PNG files are allowed'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  @ApiConsumes('multipart/form-data')
  async createJobVacancy(
    @Ctx() ctx: RequestContext,
    @Body() vacancyDetails: CreateVacancyRequestDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDto> {
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
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Job vacancy fetch failed',
  })
  async getAllJobVacancy(
    @Ctx() ctx: RequestContext,
    @Query() queryFilter: VacancyFilterDto,
  ): Promise<ListVacanciesReponseDto> {
    const [response, total] = await this.vacancyService.findMany(
      ctx,
      queryFilter,
    );

    return {
      message: 'All job fetched successfully',
      data: response,
      Pagination: takePagination(response, queryFilter, total),
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
    @Param() param: VacancyIdDto,
  ): Promise<MessageResponseDto> {
    await this.vacancyService.delete(ctx, param.vacancyId);

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
    @Ctx() ctx: RequestContext,
    @Param()
    param: VacancyIdDto,
  ): Promise<GetVacancyResponseDto> {
    const res = await this.vacancyService.getVacancy(ctx, param.vacancyId);

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
  @Require({
    permission: PermissionResource.VACANCY,
    action: PermissionAction.EDIT,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(req, file, callback) {
        const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!MIME_TYPES.includes(file.mimetype)) {
          callback(
            new NotAcceptableException('WEBP,SVG,JPG,PNG files are allowed'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiBadRequestResponse({
    description: 'Job vacancy update failed',
  })
  @ApiConsumes('multipart/form-data')
  async updateJobVacancy(
    @Ctx() ctx: RequestContext,
    @Param() param: VacancyIdDto,
    @Body() vacancyDetails: UpdateVacancyRequestDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDto> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('CV is required');
    }
    vacancyDetails.image = file;

    const updatedVacancy = await this.vacancyService.update(
      ctx,
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
