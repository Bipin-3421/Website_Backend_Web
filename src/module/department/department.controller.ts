import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDTO,
  DepartmentParamDTO,
  ListDepartmentQueryDTO,
  ListDepartmentResponseDTO,
  SingleDepartmentResponseDTO,
  UpdateDepartmentDTO,
} from './department.dto';
import { RequestContext } from 'common/request-context';
import { Ctx } from 'common/decorator/ctx.decorator';
import { ApiBadRequestResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';

@Controller('department')
@ApiTags('Department ')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Create a new department
   */
  @Post()
  @Require({
    permission: PermissionResource.DEPARTMENT,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Department creation failed',
  })
  async createDepartment(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateDepartmentDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const department = await this.departmentService.createDepartment(ctx, body);

    return {
      message: 'Department created successfully',
      data: {
        id: department.id,
      },
    };
  }

  /**
   * List all departments
   */

  @Get()
  @Require({
    permission: PermissionResource.DEPARTMENT,
    action: PermissionAction.VIEW,
  })
  @ApiOperation({ summary: 'List all departments' })
  @ApiBadRequestResponse({
    description: 'Departments fetch failed',
  })
  async getAllDepartments(
    @Ctx() ctx: RequestContext,
    @Query() query: ListDepartmentQueryDTO,
  ): Promise<ListDepartmentResponseDTO> {
    const [departments, total] =
      await this.departmentService.findManyDepartments(ctx, query);

    return {
      message: 'Departments fetched successfully',
      data: departments.map((department) => {
        return {
          id: department.id,
          name: department.name,
          createdAt: department.createdAt,
        };
      }),
      pagination: getPaginationResponse(departments, total, query),
    };
  }

  /**
   *Fetch single department
   */
  @Get(':departmentId')
  @Require({
    permission: PermissionResource.DEPARTMENT,
    action: PermissionAction.VIEW,
  })
  @ApiOperation({ summary: 'Fetch  single department' })
  @ApiBadRequestResponse({
    description: 'Department fetch failed',
  })
  async getSingleDepartment(
    @Ctx() ctx: RequestContext,
    @Param() param: DepartmentParamDTO,
  ): Promise<SingleDepartmentResponseDTO> {
    const department = await this.departmentService.findSingleDepartment(
      ctx,
      param.departmentId,
    );
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return {
      message: 'Department fetched successfully',
      data: {
        id: department.id,
        name: department.name,
        createdAt: department.createdAt,
      },
    };
  }

  /**
   * Update single department
   */
  @Patch(':departmentId')
  @Require({
    permission: PermissionResource.DEPARTMENT,
    action: PermissionAction.EDIT,
  })
  @ApiOperation({ summary: 'Update single department' })
  @ApiBadRequestResponse({
    description: 'Department updation failed',
  })
  async updateDepartment(
    @Ctx() ctx: RequestContext,
    @Body() body: UpdateDepartmentDTO,
    @Param() param: DepartmentParamDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const department = await this.departmentService.updateDepartment(
      ctx,
      body,
      param.departmentId,
    );

    return {
      message: 'Department updated successfully',
      data: {
        id: department.id,
      },
    };
  }

  /**
   * Delete single department
   */
  @Delete(':departmentId')
  @Require({
    permission: PermissionResource.DEPARTMENT,
    action: PermissionAction.EDIT,
  })
  @ApiOperation({ summary: 'Delete single department' })
  @ApiBadRequestResponse({ description: 'Department deletion failed' })
  async deleteDepartment(
    @Ctx() ctx: RequestContext,
    @Param() param: DepartmentParamDTO,
  ): Promise<MessageResponseDTO> {
    const department = await this.departmentService.deleteDepartment(
      ctx,
      param.departmentId,
    );

    return {
      message: 'Department deleted successfully',
    };
  }
}
