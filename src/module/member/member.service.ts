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
      imageId: asset.id,
    });

    return await memberRepo.save(member);
  }

  findManyMembers(
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

  async findSingleMember(ctx: RequestContext, memberId: string) {
    const memberRepo = this.connection.getRepository(ctx, Member);
    const member = await memberRepo.findOne({
      where: {
        id: memberId,
      },
      relations: { image: true },
    });

    return member;
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
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const { image, ...patch } = details;
    patchEntity(member, patch);

    let oldAssetId: string | undefined;

    if (image) {
      const asset = await this.assetService.upload(
        ctx,
        image.buffer,
        AssetFor.MEMBER,
      );

      oldAssetId = member.imageId;

      member.imageId = asset.id;
    }

    await memberRepo.save(member);

    if (oldAssetId) {
      await this.assetService.delete(ctx, oldAssetId);
    }

    return member;
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

    await memberRepo.remove(member);
    if (member.imageId) {
      await this.assetService.delete(ctx, member.imageId);
    }

    return member;
  }

  async loginMember(ctx: RequestContext, details: MemberLoginDTO) {
    const memberRepo = this.connection.getRepository(ctx, Member);

    const member = await memberRepo.findOne({
      where: {
        email: details.email,
      },
    });

    const otp = generateOTP();

    const cacheKey = `login-otp:${details.email}`;

    await this.cacheManager.set(cacheKey, otp, { ttl: 120 } as any);

    const otpDev = this.configService.get('otpDev', { infer: true });

    const message = `Your login otp is ${otp}`;
    if (!otpDev) {
      await this.mailerService.sendMail({
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

    const accessToken = signToken(payload, jwt, jwtTimeOut);

    return accessToken;
  }
}
