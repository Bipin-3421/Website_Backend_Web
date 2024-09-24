import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Query,
  Body,
  UseInterceptors,
  NotAcceptableException,
  UploadedFile,
} from '@nestjs/common';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import { CreateDesignationDTO } from './designation.dto';
import { DesignationService } from './designation.service';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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
  ) {
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

  async getAllDesignations(@Ctx() ctx: RequestContext) {
    const designations =
      await this.designationService.findManyDesignations(ctx);
  }
}
