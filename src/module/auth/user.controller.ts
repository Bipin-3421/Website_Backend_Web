import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { SignInDto } from './dto/sign.in.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from 'common/decorator/public.decorator';
import { Require } from 'common/decorator/require.decorator';
import { PermissionResource } from 'types/permission';
import { MessageResponseWithIdDto } from 'common/dto/response.dto';
import { ListGetUsersResponseDTO } from './dto/user.get.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { takePagination } from 'common/utils/pagination.utils';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @PublicRoute()
  @Require({
    resource: PermissionResource.ALL,
  })
  @ApiBody({
    type: SignInDto,
    description: 'User login details',
  })
  async login(
    @Body()
    userLoginDto: SignInDto,
  ): Promise<MessageResponseWithIdDto> {
    const res = await this.userService.login(userLoginDto);

    if (!res) {
      throw new BadRequestException('User login failed');
    }

    console.log('user logged in', res);

    return {
      message: 'User logged in successfully',
      data: {
        id: res.access_token,
      },
    };
  }

  @Post('create')
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserCreateDto,
  })
  @ApiBadRequestResponse({
    description: 'User creation failed',
  })
  @ApiBody({
    type: UserCreateDto,
    description: 'User creation details',
  })
  async createUser(
    @Body() UserCreateDto: UserCreateDto,
  ): Promise<MessageResponseWithIdDto> {
    const res = await this.userService.createUser(UserCreateDto);

    if (!res) {
      throw new BadRequestException('User creation failed');
    }

    return {
      message: 'User created successfully',
      data: {
        id: res.id,
      },
    };
  }

  @Get('/all')
  @Require({
    resource: PermissionResource.ALL,
  })
  async getAllUsers(
    @Query() pagination: PaginationDto,
  ): Promise<ListGetUsersResponseDTO> {
    const [res, total] = await this.userService.findAll(pagination);

    if (total === 0) {
      throw new BadRequestException('No users found');
    }

    return {
      message: 'All users fetched successfully',
      data: res,
      pagination: takePagination(res, pagination, total),
    };
  }
}
