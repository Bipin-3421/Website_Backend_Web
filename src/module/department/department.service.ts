import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateDepartmentDTO,
  ListDepartmentQueryDTO,
  UpdateDepartmentDTO,
} from './department.dto';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Department } from 'common/entities/department.entity';
import { ILike } from 'typeorm';
import { patchEntity } from 'common/utils/patchEntity';

@Injectable()
export class DepartmentService {
  constructor(private readonly connection: TransactionalConnection) {}

  async createDepartment(ctx: RequestContext, body: CreateDepartmentDTO) {
    const departmentRepo = this.connection.getRepository(ctx, Department);
    const department = new Department({
      name: body.name,
    });
    return await departmentRepo.save(department);
  }

  async findManyDepartments(
    ctx: RequestContext,
    query: ListDepartmentQueryDTO,
  ) {
    const { search, take = 10, page = 0 } = query;
    const skip = take * page;

    return this.connection.getRepository(ctx, Department).findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : undefined,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findSingleDepartment(ctx: RequestContext, departmentId: string) {
    const departmentRepo = this.connection.getRepository(ctx, Department);
    const department = await departmentRepo.findOne({
      where: {
        id: departmentId,
      },
    });
    return department;
  }

  async updateDepartment(
    ctx: RequestContext,
    body: UpdateDepartmentDTO,
    departmentId: string,
  ) {
    const departmentRepo = this.connection.getRepository(ctx, Department);
    const department = await departmentRepo.findOne({
      where: {
        id: departmentId,
      },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    patchEntity(department, body);
    return await departmentRepo.save(department);
  }

  async deleteDepartment(ctx: RequestContext, departmentId: string) {
    const departmentRepo = this.connection.getRepository(ctx, Department);
    const department = await departmentRepo.findOne({
      where: {
        id: departmentId,
      },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return await departmentRepo.remove(department);
  }
}
