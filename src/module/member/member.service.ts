import { Injectable } from '@nestjs/common';
import { AssetService } from 'asset/asset.service';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';
import { CreateMemberRequestDTO } from './dto/createMember.dto';
import { Member } from 'common/entities/member.entity';
import { AssetFor } from 'common/enum/asset.for.enum';

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
}
