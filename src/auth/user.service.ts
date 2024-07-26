import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserCreateDto } from 'module/auth/dto/user.create.dto';
import { User } from 'common/entities/user.entity';
import { SignInDto } from 'module/auth/dto/sign.in.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
      sub: user.id,
      username: user.firstName,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
