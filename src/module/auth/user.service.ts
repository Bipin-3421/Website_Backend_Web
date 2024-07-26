import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { SignInDto } from './dto/sign.in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { verify } from 'crypto';
import { signToken } from 'common/utils/jwt.utils';
import { JwtPayload } from 'common/dto/jwt.payload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: UserCreateDto): Promise<User> {
    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      isActive: createUserDto.isActive,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async login(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: {
        firstName: signInDto.username,
        lastName: signInDto.password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
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
