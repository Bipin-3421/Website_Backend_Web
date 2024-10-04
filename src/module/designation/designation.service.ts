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

@Injectable()
export class DesignationService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async createDesignation(ctx: RequestContext, body: CreateDesignationDTO) {
    const designationRepo = this.connection.getRepository(ctx, Designation);
    const departmentRepo = this.connection.getRepository(ctx, Department);

    const department = await departmentRepo.exists({
      where: { id: body.departmentId },
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
      departmentId: body.departmentId,
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
      where: whereClause,
      relations: { image: true, department: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findSingleDesignation(ctx: RequestContext, designationId: string) {
    const designationRepo = this.connection.getRepository(ctx, Designation);

    const designation = await designationRepo.findOne({
      where: {
        id: designationId,
      },
      relations: { image: true, department: true },
    });

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
    });

    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    const { image, ...patch } = details;
    patchEntity(designation, patch);

    let oldAssetId: string | undefined;

    if (image) {
      const asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.DESIGNATION,
      );

      oldAssetId = designation.imageId;

      designation.imageId = asset.id;
    }

    await designationRepo.save(designation);

    if (oldAssetId) {
      await this.assetService.delete(ctx, oldAssetId);
    }

    return designation;
  }

  async deleteDesignation(ctx: RequestContext, designationId: string) {
    const designationRepo = this.connection.getRepository(ctx, Designation);

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
