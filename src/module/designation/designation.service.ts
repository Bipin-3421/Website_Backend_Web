import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from 'common/request-context';
import {
  CreateDesignationDTO,
  ListDesignationQueryDTO,
  UpdateDesignationDTO,
} from './designation.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Designation } from 'common/entities/designation.entity';
import { AssetService } from 'asset/asset.service';
import { AssetFor } from 'common/enum/asset.for.enum';
import { Department } from 'common/entities/department.entity';
import { FindOptionsWhere, ILike } from 'typeorm';
import { patchEntity } from 'common/utils/patchEntity';
import { Asset } from 'common/entities/asset.entity';

@Injectable()
export class DesignationService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async createDesignation(ctx: RequestContext, body: CreateDesignationDTO) {
    const designationRepo = this.connection.getRepository(Designation);
    const departmentRepo = this.connection.getRepository(Department);

    const department = await departmentRepo.findOne({
      where: { name: body.department },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const asset = await this.assetService.upload(
      ctx,
      body.image.buffer,
      AssetFor.DESIGNATION,
    );

    const designation = new Designation({
      name: body.name,
      image: asset,
      departmentId: department.id,
      description: body.description,
    });

    return await designationRepo.save(designation);
  }
  async findManyDesignations(
    ctx: RequestContext,
    query: ListDesignationQueryDTO,
  ) {
    const { search, page = 10, take = 0 } = query;

    const skip = take * page;

    const whereClause: FindOptionsWhere<Designation>[] = [
      { name: search ? ILike(`%${search}%`) : undefined },
      { department: search ? { name: ILike(`%${search}%`) } : undefined },
    ];

    return this.connection.getRepository(ctx, Designation).findAndCount({
      where: whereClause.length ? whereClause : undefined,
      relations: { image: true, department: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }
  async findSingleDesignation(ctx: RequestContext, designationId: string) {
    const designationRepo = this.connection.getRepository(Designation);

    const designation = await designationRepo.findOne({
      where: {
        id: designationId,
      },
      relations: { image: true, department: true },
    });
    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    return designation;
  }
  async updateDesignation(
    ctx: RequestContext,
    details: UpdateDesignationDTO,
    designationId: string,
  ) {
    const designationRepo = this.connection.getRepository(ctx, Designation);

    const designation = await designationRepo.findOne({
      where: {
        id: designationId,
      },
      relations: { image: !!details.image, department: !!details.department },
    });

    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    const { image, department, ...patch } = details;
    patchEntity(designation, patch);

    let asset: Asset | undefined;
    if (image) {
      asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.DESIGNATION,
      );

      designation.image = asset;
    }

    return await designationRepo.save(designation);
  }

  async deleteDesignation(ctx: RequestContext, designationId: string) {
    const designationRepo = this.connection.getRepository(Designation);

    const designation = await designationRepo.findOne({
      where: {
        id: designationId,
      },
    });

    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    return await designationRepo.remove(designation);
  }
}
