import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from 'common/request-context';
import { CreateDesignationDTO } from './designation.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Designation } from 'common/entities/designation.entity';
import { AssetService } from 'asset/asset.service';
import { AssetFor } from 'common/enum/asset.for.enum';
import { Department } from 'common/entities/department.entity';

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
  async findManyDesignations(ctx: RequestContext) {}
}

// 61073b59-4365-413f-b97f-dc98bf209329
