import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'common/entities/user.entity';
import { UserCreateDto } from './dto/user.create.dto';
import { SignInDto } from './dto/sign.in.dto';
import { ConfigService } from '@nestjs/config';
import { signToken } from 'common/utils/jwt.utils';
import { AuthPayload } from 'types/jwt';
import { PaginationDto } from 'common/dto/pagination.dto';
import { RequestContext } from '../../common/request-context';
import { AppConfig } from '../../config/configuration';
import { TransactionalConnection } from 'module/connection/connection.service';
import { PermissionAction, PermissionResource } from 'types/permission';

@Injectable()
export class UserService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async createUser(
    ctx: RequestContext,
    createUserDto: UserCreateDto,
  ): Promise<User> {
    const userRepo = this.connection.getRepository(ctx, User);

    const defaultPermission = {
      resource: PermissionResource.ALL,
      action: [PermissionAction.EDIT, PermissionAction.VIEW],
    };

    const user = new User({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      permission: [defaultPermission],
      isActive: true,
    });

    return await userRepo.save(user);
  }

  async findAll(ctx: RequestContext, pagination: PaginationDto) {
    const userRepo = this.connection.getRepository(ctx, User);

    return await userRepo.findAndCount({
      take: pagination.take,
      skip: pagination.page,
    });
  }

  async login(
    ctx: RequestContext,
    signInDto: SignInDto,
  ): Promise<{ access_token: string }> {
    const userRepo = this.connection.getRepository(ctx, User);

    const user = await userRepo.findOne({
      where: {
        firstName: signInDto.firstName,
        lastName: signInDto.lastName,
      },
    });

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthPayload = {
      userId: user.id,
      permission: user.permission,
    };

    return {
      access_token: signToken(
        payload,
        this.configService.get('Jwt.JwtSecret', { infer: true }) ?? '',
        this.configService.get('Jwt.JwtTimeOut', { infer: true }) ?? '1h',
      ),
    };
  }
}
