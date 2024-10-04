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
import { CreateApplicantDto } from './dto/create.applicant.dto';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { ApplicantFilterDto } from './dto/applicant.search.dto';
import {
  ListApplicantsResponseDto,
  SingleApplicantResponseDTO,
} from './dto/get.applicant.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { PublicRoute } from 'common/decorator/public.decorator';
import { ApplicantParamDTO } from './dto/param.dto';
import { PatchApplicantDto } from './dto/patch.applicant.dto';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import { Transaction } from 'common/decorator/transaction.decorator';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';
import { fileUpload } from 'common/file-upload.interceptor';

@Controller('applicant')
@ApiTags('Applicant ')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  /**
   * Create a new applicant
   */
  @Post()
  @PublicRoute()
  @UseInterceptors(fileUpload('cv'))
  @Transaction()
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  async createApplicant(
    @Ctx() ctx: RequestContext,
    @Body() applicantDetail: CreateApplicantDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('CV is required');
    }

    applicantDetail.cv = file;

    const applicant = await this.applicantService.create(ctx, applicantDetail);

    return {
      message: 'Applicant created successfully',
      data: {
        id: applicant.id,
      },
    };
  }

  /**
   * List all applicants
   */
  @Get()
  @Require({
    permission: PermissionResource.APPLICANT,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Applicant fetch failed',
  })
  async getAllJobApplicants(
    @Ctx() ctx: RequestContext,
    @Query() queryFilter: ApplicantFilterDto,
  ): Promise<ListApplicantsResponseDto> {
    const [applicants, total] = await this.applicantService.findMany(
      ctx,
      queryFilter,
    );

    return {
      message: 'All job fetched successfully',
      data: applicants.map((applicant) => {
        return {
          id: applicant.id,
          name: applicant.name,
          email: applicant.email,
          phoneNumber: applicant.phoneNumber,
          address: applicant.address,
          createdAt: applicant.createdAt,
          cv: {
            id: applicant.cv.id,
            name: applicant.cv.name,
            url: applicant.cv.url,
          },
          githubUrl: applicant.githubUrl,
          portfolioUrl: applicant.portfolioUrl,
          referralSource: applicant.referralSource,
          workExperience: applicant.workExperience,
          vacancyId: applicant.vacancyId,
          status: applicant.status,
        };
      }),
      pagination: getPaginationResponse(applicants, total, queryFilter),
    };
  }

  /**
   * Fetch single applicant
   */
  @Get(':applicantId')
  @Require({
    permission: PermissionResource.APPLICANT,
    action: PermissionAction.VIEW,
  })
  async getSingleApplicant(
    @Ctx() ctx: RequestContext,
    @Param() param: ApplicantParamDTO,
  ): Promise<SingleApplicantResponseDTO> {
    const applicant = await this.applicantService.findSingleAplicant(
      ctx,
      param.applicantId,
    );

    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    return {
      message: 'Applicant fetched successfully',
      data: {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        address: applicant.address,
        createdAt: applicant.createdAt,
        cvId: applicant.cvId,
        githubUrl: applicant.githubUrl,
        portfolioUrl: applicant.portfolioUrl,
        referralSource: applicant.referralSource,
        workExperience: applicant.workExperience,
        vacancyId: applicant.vacancyId,
        status: applicant.status,
      },
    };
  }

  /**
   * Update single applicant
   */
  @Patch(':applicantId')
  @Require({
    permission: PermissionResource.APPLICANT,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Applicant Status Patch failed',
  })
  async patchApplicantStatus(
    @Ctx() ctx: RequestContext,
    @Param() applicantParamDto: ApplicantParamDTO,
    @Body() status: PatchApplicantDto,
  ): Promise<MessageResponseDTO> {
    const res = await this.applicantService.update(
      ctx,
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

  /**
   *Delete single applicant
   */
  @Delete(':applicantId')
  @Require({
    permission: PermissionResource.APPLICANT,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Job vacancy creation failed',
  })
  async deleteApplicant(
    @Ctx() ctx: RequestContext,
    @Param() applicantParamDto: ApplicantParamDTO,
  ): Promise<MessageResponseDTO> {
    const status = await this.applicantService.delete(
      ctx,
      applicantParamDto.applicantId,
    );

    if (!status) {
      throw new NotAcceptableException('Applicant not found');
    }

    return {
      message: 'Applicant deleted successfully',
    };
  }
}
