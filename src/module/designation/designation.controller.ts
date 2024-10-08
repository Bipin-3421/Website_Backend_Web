import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  UseInterceptors,
  NotAcceptableException,
  UploadedFile,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import {
  CreateDesignationDTO,
  DesignationIdDTO,
  GetDesignationResponseDTO,
  ListDesignationQueryDTO,
  ListDesignationResponseDTO,
  UpdateDesignationDTO,
} from './designation.dto';
import { DesignationService } from './designation.service';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';
import { fileUpload } from 'common/file-upload.interceptor';

@Controller('designation')
@ApiTags('Designation')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  /**
   * Create a new designation
   */
  @Post()
  @Require({
    permission: PermissionResource.DESIGNATION,
    action: PermissionAction.EDIT,
  })
  @UseInterceptors(fileUpload('image'))
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

  /**
   * List all designations
   */
  @Get('')
  @Require({
    permission: PermissionResource.DESIGNATION,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Designation list fetch failed',
  })
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
          image: {
            id: designation.image.id,
            name: designation.image.name,
            url: designation.image.url,
          },
          department: {
            id: designation.department.id,
            name: designation.department.name,
          },
          description: designation.description,
        };
      }),
      pagination: getPaginationResponse(designations, total, query),
    };
  }

  /**
   * Fetch single designation
   */
  @Get(':designationId')
  @Require({
    permission: PermissionResource.DESIGNATION,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Single Designation fetch failed',
  })
  async getSingleDesignation(
    @Ctx() ctx: RequestContext,
    @Param() param: DesignationIdDTO,
  ): Promise<GetDesignationResponseDTO> {
    const designation = await this.designationService.findSingleDesignation(
      ctx,
      param.designationId,
    );
    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

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
        image: {
          id: designation.image.id,
          name: designation.image.name,
          url: designation.image.url,
        },
        description: designation.description,
      },
    };
  }

  /**
   * Update single Designation
   */
  @Patch(':designationId')
  @Require({
    permission: PermissionResource.DESIGNATION,
    action: PermissionAction.EDIT,
  })
  @UseInterceptors(fileUpload('image'))
  @ApiBadRequestResponse({
    description: 'Designation updation failed',
  })
  @ApiConsumes('multipart/form-data')
  async updateDesignation(
    @Ctx() ctx: RequestContext,
    @Body() body: UpdateDesignationDTO,
    @UploadedFile() file: Express.Multer.File | null,
    @Param() param: DesignationIdDTO,
  ): Promise<MessageResponseWithIdDTO> {
    body.image = file || undefined;
    const updatedDegination = await this.designationService.updateDesignation(
      ctx,
      body,
      param.designationId,
    );

    return {
      message: 'Designation updated successfully',
      data: {
        id: updatedDegination.id,
      },
    };
  }

  /**
   * Delete single designation
   */
  @Delete(':designationId')
  @Require({
    permission: PermissionResource.DESIGNATION,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Designation deletion failed',
  })
  async deleteDesignation(
    @Ctx() ctx: RequestContext,
    @Param() param: DesignationIdDTO,
  ): Promise<MessageResponseDTO> {
    await this.designationService.deleteDesignation(ctx, param.designationId);

    return {
      message: 'Designation deleted successfully',
    };
  }
}
