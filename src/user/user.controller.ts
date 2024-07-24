import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from 'common/response/api.response';
import { UserCreateDto } from './dto/user.create.dto';
import { log } from 'console';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() UserCreateDto: UserCreateDto,
  ): Promise<ApiResponse<string>> {
    const res = await this.userService.createUser(UserCreateDto);

    console.log('create user data', res);

    if (res.id) {
      return new ApiResponse(200, 'User created successfully', '');
    }

    return new ApiResponse(400, 'User creation failed', '');
  }
}
