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
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { ApplicantFilterDto } from './dto/applicant.search.dto';
import { ListApplicantsResponseDto } from './dto/get.applicant.dto';
import { takePagination } from 'common/utils/pagination.utils';
import { PublicRoute } from 'common/decorator/public.decorator';
import { ApplicantParamDto } from './dto/param.dto';
import { PatchApplicantDto } from './dto/patch.applicant.dto';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import { Transaction } from 'common/decorator/transaction.decorator';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';

@Controller('applicant')
@ApiTags('Applicant API')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Post()
  @PublicRoute()
  @UseInterceptors(
    FileInterceptor('CV', {
      fileFilter(req, file, callback) {
        const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!MIME_TYPES.includes(file.mimetype)) {
          callback(
            new NotAcceptableException('Only JPEG and PNG files are allowed'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
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
    @Param() applicantParamDto: ApplicantParamDto,
  ): Promise<MessageResponseDto> {
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
    const [response, total] = await this.applicantService.findMany(
      ctx,
      queryFilter,
    );

    return {
      message: 'All job fetched successfully',
      data: response,
      pagination: takePagination(response, queryFilter, total),
    };
  }

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
    @Param() applicantParamDto: ApplicantParamDto,
    @Body() status: PatchApplicantDto,
  ): Promise<MessageResponseDto> {
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
}
