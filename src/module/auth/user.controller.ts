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
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'common/decorator/public.decorator';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';
import { MessageResponseWithIdDto } from 'common/dto/response.dto';
import { ListGetUsersResponseDTO } from './dto/user.get.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { takePagination } from 'common/utils/pagination.utils';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @PublicRoute()
  @ApiBody({
    type: SignInDto,
    description: 'User login details',
  })
  async login(
    @Ctx() ctx: RequestContext,
    @Body()
    userLoginDto: SignInDto,
  ): Promise<MessageResponseWithIdDto> {
    const res = await this.userService.login(ctx, userLoginDto);

    if (!res) {
      throw new BadRequestException('User login failed');
    }

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
  @Require({
    permission: PermissionResource.ALL,
    action: PermissionAction.EDIT,
  })
  async createUser(
    @Ctx() ctx: RequestContext,
    @Body() UserCreateDto: UserCreateDto,
  ): Promise<MessageResponseWithIdDto> {
    const res = await this.userService.createUser(ctx, UserCreateDto);

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
    permission: PermissionResource.ALL,
    action: PermissionAction.VIEW,
  })
  async getAllUsers(
    @Ctx() ctx: RequestContext,
    @Query() pagination: PaginationDto,
  ): Promise<ListGetUsersResponseDTO> {
    const [res, total] = await this.userService.findAll(ctx, pagination);

    return {
      message: 'All users fetched successfully',
      data: res,
      pagination: takePagination(res, pagination, total),
    };
  }
}
