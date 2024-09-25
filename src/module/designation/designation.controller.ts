import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseInterceptors,
  NotAcceptableException,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import {
  CreateDesignationDTO,
  DesignationIdDTO,
  GetDesignationResponseDTO,
  ListDesignationQueryDTO,
  ListDesignationResponseDTO,
} from './designation.dto';
import { DesignationService } from './designation.service';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { MessageResponseWithIdDTO } from 'common/dto/response.dto';

@Controller('designation')
@ApiTags('Designation Api')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
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
    description: 'Designation creation failed',
  })
  @ApiConsumes('multipart/form-data')
  async createDesignation(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateDesignationDTO,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('Designation image is required');
    }

    body.image = file;

    const designation = await this.designationService.createDesignation(
      ctx,
      body,
    );

    return {
      message: 'Designation created successfully',
      data: {
        id: designation.id,
      },
    };
  }

  @ApiBadRequestResponse({
    description: 'Designations fetch failed',
  })
  @Get('')
  async getAllDesignations(
    @Ctx() ctx: RequestContext,
    @Query() query: ListDesignationQueryDTO,
  ): Promise<ListDesignationResponseDTO> {
    const [designations, total] =
      await this.designationService.findManyDesignations(ctx, query);

    return {
      message: 'Designations fetched successfully',
      data: designations.map((designation) => {
        return {
          id: designation.id,
          name: designation.name,
          createdAt: designation.createdAt,
          updatedAt: designation.updatedAt,
          image: {
            id: designation.image.id,
            name: designation.image.name,
            url: designation.image.url,
          },
          imageId: designation.imageId,
          department: {
            id: designation.department.id,
            name: designation.department.name,
          },
          departmentId: designation.departmentId,
          description: designation.description,
        };
      }),
      pagination: getPaginationResponse(designations, total, query),
    };
  }

  @ApiBadRequestResponse({
    description: 'Single Designation fetch failed',
  })
  @Get(':designationId')
  async getSingleDesignation(
    @Ctx() ctx: RequestContext,
    @Param() param: DesignationIdDTO,
  ): Promise<GetDesignationResponseDTO> {
    const designation = await this.designationService.findSingleDesignation(
      ctx,
      param.designationId,
    );

    return {
      message: 'Designation fetched successfully',
      data: {
        id: designation.id,
        name: designation.name,
        createdAt: designation.createdAt,
        department: {
          id: designation.department.id,
          name: designation.department.name,
        },
        departmentId: designation.departmentId,
        image: {
          id: designation.image.id,
          name: designation.image.name,
          url: designation.image.url,
        },
        imageId: designation.imageId,
        description: designation.description,
      },
    };
  }
}
