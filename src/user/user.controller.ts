import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from 'common/response/api.response';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from 'common/entities/user.entity';
import { SignInDto } from './dto/sign.in.dto';
import { JwtServiceImpl } from 'common/guard/jwt.guard';
import { log } from 'console';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body()
    userLoginDto: SignInDto,
  ): Promise<ApiResponse<any>> {
    const res = await this.userService.login(userLoginDto);

    if (res) {
      console.log('user logged in', res);

      return new ApiResponse(200, 'User logged in successfully', res);
    }

    return new ApiResponse(400, 'User login failed', '');
  }

  @Post('create')
  @UseGuards(JwtServiceImpl)
  async createUser(
    @Body() UserCreateDto: UserCreateDto,
  ): Promise<ApiResponse<Object>> {
    const res = await this.userService.createUser(UserCreateDto);

    console.log('create user data', res);

    if (res) {
      console.log('user created', res);
      return new ApiResponse(200, 'User created successfully', res);
    }

    return new ApiResponse(400, 'User creation failed', '');
  }

  @Get('/all')
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const res = await this.userService.findAll();

    console.log('all users', res);

    return new ApiResponse(200, 'All users fetched successfully', res);
  }
}
