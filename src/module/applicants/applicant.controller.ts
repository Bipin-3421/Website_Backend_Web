import {
  Body,
  Controller,
  Delete,
  Get,
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
    applicantDetail.cv = file;
    const applicant = await this.applicantService.create(applicantDetail);

    return {
      message: 'Applicant created successfully',
      data: {
        id: applicant.id,
      },
    };
  }

  @Delete(':id')
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  async deleteApplicant(@Param('id') id: string): Promise<MessageResponseDto> {
    await this.applicantService.delete(id);

    return {
      message: 'Applicant deleted successfully',
    };
  }

  @Get()
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
      Pagination: takePagination(response, queryFilter, total),
    };
  }

  @Patch(':id')
  @ApiBadRequestResponse({
    description: 'Applicant Status Patch failed',
  })
  async patchApplicantStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<MessageResponseDto> {
    await this.applicantService.patchStatus(id, status);

    return {
      message: 'Applicant status updated successfully',
    };
  }
}
