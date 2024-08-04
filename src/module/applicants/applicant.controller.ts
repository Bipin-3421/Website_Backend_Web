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
import { ApplicantService } from './applicant.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateApplicantDto } from './dto/create.applicant.dto';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  MessageResponseDto,
  MessageResponseWithIdDto,
} from 'common/dto/response.dto';
import { ApplicantFilterDto } from './dto/applicant.search.dto';
import { ListApplicantsResponseDto } from './dto/get.applicant.dto';
import { takePagination } from 'common/utils/pagination.utils';
import { PublicRoute } from 'common/decorator/public.decorator';
import { ApplicantParamDto } from './dto/param.dto';
import { ApplicationStatus } from 'common/enum/applicant.status.enum';

@Controller('applicant')
@ApiTags('Applicant API')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post()
  @UseInterceptors(FileInterceptor('CV'))
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  async createApplicant(
    @Body() applicantDetail: CreateApplicantDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageResponseWithIdDto> {
    if (file === undefined || file.size == 0) {
      throw new NotAcceptableException('CV is required');
    }
    applicantDetail.cv = file;
    const applicant = await this.applicantService.create(applicantDetail);

    return {
      message: 'Applicant created successfully',
      data: {
        id: applicant.id,
      },
    };
  }

  @Delete(':applicantId')
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  async deleteApplicant(
    @Param() applicantParamDto: ApplicantParamDto,
  ): Promise<MessageResponseDto> {
    const status = await this.applicantService.delete(
      applicantParamDto.applicantId,
    );

    if (!status) {
      throw new NotAcceptableException('Applicant not found');
    }

    return {
      message: 'Applicant deleted successfully',
    };
  }

  @Get()
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Applicant fetch failed',
  })
  async getAllJobApplicants(
    @Query() queryFilter: ApplicantFilterDto,
  ): Promise<ListApplicantsResponseDto> {
    const [response, total] = await this.applicantService.findMany(queryFilter);

    return {
      message: 'All job fetched successfully',
      data: response,
      pagination: takePagination(response, queryFilter, total),
    };
  }

  @Patch(':applicantId')
  @ApiBadRequestResponse({
    description: 'Applicant Status Patch failed',
  })
  async patchApplicantStatus(
    @Param() applicantParamDto: ApplicantParamDto,
    @Body('status') status: ApplicationStatus,
  ): Promise<MessageResponseDto> {
    const res = await this.applicantService.update(
      applicantParamDto.applicantId,
      status,
    );

    if (!res) {
      throw new NotFoundException('Applicant not found');
    }

    return {
      message: 'Applicant status updated successfully',
    };
  }
}
