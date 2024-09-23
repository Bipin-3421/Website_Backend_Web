import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDTO, ListDepartmentQueryDTO } from './department.dto';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Department } from 'common/entities/department.entity';
import { FindOptionsWhere, ILike } from 'typeorm';
import { patchEntity } from 'common/utils/patchEntity';

@Injectable()
export class DepartmentService {
  constructor(private readonly connection: TransactionalConnection) {}

  async createDepartment(body: CreateDepartmentDTO, ctx: RequestContext) {
    const departmentRepo = this.connection.getRepository(ctx, Department);
    const department = new Department({
      department: body.department,
    });
    return await departmentRepo.save(department);
  }

  async findManyDepartments(
    ctx: RequestContext,
    query: ListDepartmentQueryDTO,
  ) {
    const { search, take, page } = query;
    const skip = (take || 0) * (page || 0);
    const whereClause: FindOptionsWhere<Department>[] = [
      { department: search ? ILike(`%${search}%`) : undefined },
    ];
    return this.connection.getRepository(ctx, Department).findAndCount({
      where: whereClause.length ? whereClause : undefined,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async editDepartment(
    ctx: RequestContext,
    body: CreateDepartmentDTO,
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
      throw new NotFoundException('Contact not found');
    }
    return await departmentRepo.remove(department);
  }
}
