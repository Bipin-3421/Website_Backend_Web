import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDTO,
  DepartmentParamDTO,
  ListDepartmentQueryDTO,
  ListDepartmentResponseDTO,
} from './department.dto';
import { RequestContext } from 'common/request-context';
import { Ctx } from 'common/decorator/ctx.decorator';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { PublicRoute } from 'common/decorator/public.decorator';

@Controller('department')
@ApiTags('Department Api')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiBadRequestResponse({
    description: 'Department creation failed',
  })
  async createDepartment(
    @Body() body: CreateDepartmentDTO,
    @Ctx() ctx: RequestContext,
  ): Promise<MessageResponseWithIdDTO> {
    const department = await this.departmentService.createDepartment(body, ctx);
    return {
      message: 'Department created successfully',
      data: {
        id: department.id,
      },
    };
  }

  @Get()
  @ApiBadRequestResponse({
    description: 'Departments fetch failed',
  })
  async getAllDepartments(
    @Ctx() ctx: RequestContext,
    @Query() query: ListDepartmentQueryDTO,
  ): Promise<ListDepartmentResponseDTO> {
    const [response, total] = await this.departmentService.findManyDepartments(
      ctx,
      query,
    );
    return {
      message: 'Departments fetched successfully',
      data: response.map((res) => {
        return {
          id: res.id,
          department: res.department,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
        };
      }),
      pagination: getPaginationResponse(response, total, query),
    };
  }

  @Patch(':departmentId')
  @ApiBadRequestResponse({
    description: 'Department updation failed',
  })
  async editDepartment(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateDepartmentDTO,
    @Param() param: DepartmentParamDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const department = await this.departmentService.editDepartment(
      ctx,
      body,
      param.departmentId,
    );
    return {
      message: 'Department edited successfully',
      data: {
        id: department.id,
      },
    };
  }

  @Delete(':departmentId')
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
