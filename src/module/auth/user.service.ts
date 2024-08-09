import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { SignInDto } from './dto/sign.in.dto';
import { ConfigService } from '@nestjs/config';
import { signToken } from 'common/utils/jwt.utils';
import { AuthPayload } from 'types/jwt';
import { PermissionResource } from '../../types/permission';
import { PaginationDto } from 'common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly DataSource: DataSource,
  ) {}

  async createUser(createUserDto: UserCreateDto): Promise<User> {
    const user = {
      ...createUserDto,
      permission: [PermissionResource.ALL],
    };

    return await this.userRepository.save(user);
  }

  async findAll(pagination: PaginationDto) {
    const userRepo = this.DataSource.getRepository(User);

    return await userRepo.findAndCount({
      take: pagination.take,
      skip: pagination.page,
    });
  }

  async login(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: {
        firstName: signInDto.firstName,
        lastName: signInDto.lastName,
      },
    });

    console.log('user', user);

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthPayload = {
      userId: user.id,
      permission: user.permission ? user.permission : undefined,
    };

    return {
      access_token: signToken(
        payload,
        this.configService.get('JWT_SECRET', { infer: true }) ?? '',
        this.configService.get('JWT_TIMEOUT', { infer: true }) ?? '1h',
      ),
    };
  }
}
