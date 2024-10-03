import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { AssetService } from 'asset/asset.service';
import { RequestContext } from 'common/request-context';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Member } from 'common/entities/member.entity';
import { AssetFor } from 'common/enum/asset.for.enum';
import {
  CreateMemberRequestDTO,
  ListMemberQueryDTO,
  MemberLoginDTO,
  MemberVerifyDTO,
  UpdateMemberRequestDTO,
} from './member.dto';
import { FindOptionsWhere, ILike } from 'typeorm';
import { patchEntity } from 'common/utils/patchEntity';
import { Asset } from 'common/entities/asset.entity';
import { seedSuperAdmin } from 'common/seeds/backofficeSuperAdmin.seed';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'config/configuration';
import { generateOTP } from 'common/utils/generateOTP';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthPayload } from 'types/jwt';
import { signToken } from 'common/utils/jwt.utils';

@Injectable()
export class MemberService implements OnApplicationBootstrap {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly assetService: AssetService,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await seedSuperAdmin(this.connection, this.configService);
  }

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
      phoneNumber: body.phoneNumber,
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
      { name: search ? ILike(`%${search}%`) : undefined, role },
      { email: search ? ILike(`%${search}%`) : undefined, role },
      { phoneNumber: search ? ILike(`%${search}%`) : undefined, role },
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

    const member = await memberRepo.findOne({
      where: {
        id: memberId,
      },
      relations: { image: !!details.image },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const { image, ...patch } = details;
    patchEntity(member, patch);

    let asset: Asset | undefined;
    if (image) {
      asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.MEMBER,
      );

      member.image = asset;
    }

    return await memberRepo.save(member);
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

  async loginMember(ctx: RequestContext, details: MemberLoginDTO) {
    const memberRepo = this.connection.getRepository(ctx, Member);

    const member = await memberRepo.findOne({
      where: {
        email: details.email,
      },
    });

    if (!member) throw new NotFoundException('Member not found');

    const otp = generateOTP();

    const cacheKey = `login-otp:${details.email}`;

    await this.cacheManager.set(cacheKey, otp, { ttl: 120 } as any);

    const mail = this.configService.get('mail', { infer: true });

    const message = `Your login otp is ${otp}`;
    if (mail.otp !== 'dev') {
      this.mailerService.sendMail({
        to: details.email,
        subject: `OTP for backoffice blacktech login`,
        html: message,
      });
    }

    return member;
  }

  async verifyMember(ctx: RequestContext, details: MemberVerifyDTO) {
    const memberRepo = this.connection.getRepository(ctx, Member);

    const member = await memberRepo.findOne({
      where: {
        email: details.email,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const cacheKey = `login-otp:${details.email}`;

    const cachedOTP = await this.cacheManager.get<string>(cacheKey);
    console.log(cachedOTP);

    if (!cachedOTP) {
      throw new BadRequestException('OTP has expired ');
    }

    if (cachedOTP !== details.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const jwt = this.configService.get('jwt.jwtSecret', { infer: true });
    const jwtTimeOut = this.configService.get('jwt.jwtTimeOut', {
      infer: true,
    });

    const payload: AuthPayload = {
      memberId: member.id,
      role: member.role,
    };

    const access_token = signToken(payload, jwt, jwtTimeOut);

    return access_token;
  }
}
