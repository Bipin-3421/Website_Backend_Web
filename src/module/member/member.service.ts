import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from 'asset/asset.service';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Member } from 'common/entities/member.entity';
import { AssetFor } from 'common/enum/asset.for.enum';
import {
  CreateMemberRequestDTO,
  ListMemberQueryDTO,
  UpdateMemberRequestDTO,
} from './member.dto';
import { FindOptionsWhere, ILike } from 'typeorm';
import { patchEntity } from 'common/utils/patchEntity';
import { Asset } from 'common/entities/asset.entity';
@Injectable()
export class MemberService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
  ) {}

  async create(ctx: RequestContext, body: CreateMemberRequestDTO) {
    const memberRepo = this.connection.getRepository(ctx, Member);

    const asset = await this.assetService.upload(
      ctx,
      body.image.buffer,
      AssetFor.MEMBER,
    );

    const member = new Member({
      name: body.name,
      email: body.email,
      phoneNumer: body.phoneNumber,
      designation: body.designation,
      role: body.role,
      image: asset,
    });

    return await memberRepo.save(member);
  }
  async findManyMembers(
    ctx: RequestContext,
    query: ListMemberQueryDTO,
  ): Promise<[Member[], number]> {
    const { search, take, page, role } = query;

    const skip = (take || 0) * (page || 0);

    const whereClause: FindOptionsWhere<Member>[] = [
      { name: search ? ILike(`%${search}%`) : undefined },
      { email: search ? ILike(`%${search}%`) : undefined },
      { phoneNumer: search ? ILike(`%${search}%`) : undefined },
      { role: role ? role : undefined },
    ];

    return this.connection.getRepository(ctx, Member).findAndCount({
      where: whereClause.length ? whereClause : undefined,
      relations: { image: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async updateMember(
    ctx: RequestContext,
    details: UpdateMemberRequestDTO,
    memberId: string,
  ) {
    const memberRepo = this.connection.getRepository(ctx, Member);

    const originalMemberDetails = await memberRepo.findOne({
      where: {
        id: memberId,
      },
      relations: { image: true },
    });

    if (!originalMemberDetails) {
      throw new NotFoundException('Member not found');
    }

    const { image, ...patch } = details;
    patchEntity(originalMemberDetails, patch);

    let asset: Asset | undefined;
    if (image) {
      asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.MEMBER,
      );

      originalMemberDetails.image = asset;
    }

    return await memberRepo.save(originalMemberDetails);
  }

  async deleteMember(ctx: RequestContext, memberId: string) {
    const memberRepo = this.connection.getRepository(ctx, Member);

    const member = await memberRepo.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return await memberRepo.remove(member);
  }
}
