import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRespositry: Repository<User>,
  ) {}

  async createUser(createUserDto: UserCreateDto): Promise<User> {
    const user = new User({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      isActive: createUserDto.isActive,
    });

    return await this.userRespositry.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRespositry.find();
  }
}
