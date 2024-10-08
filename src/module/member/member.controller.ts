import {
  Body,
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  UseInterceptors,
  NotAcceptableException,
  UploadedFile,
  Query,
  Res,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { RequestContext } from 'common/request-context';
import { Ctx } from 'common/decorator/ctx.decorator';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  CreateMemberRequestDTO,
  ListMemberQueryDTO,
  MemberParamDTO,
  UpdateMemberRequestDTO,
  MemberLoginDTO,
  MemberVerifyDTO,
  VerifyResponseDTO,
  ListMemberResponseDTO,
  SingleMemberResponseDTO,
} from './member.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { PublicRoute } from 'common/decorator/public.decorator';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';
import { FileUpload } from 'common/file-upload.interceptor';
import { attachToken } from 'common/utils/attachToken';
import { Response } from 'express';
import { Throws } from 'common/decorator/throws.decorator';
import { ValidationException } from 'common/errors/validation.error';

@Controller('member')
@ApiTags('Member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /**
   * Create a new member
   */
  @Post()
  @Require({
    permission: PermissionResource.MEMBER,
    action: PermissionAction.EDIT,
  })
  @Throws(
    UnauthorizedException,
    ValidationException,
    BadRequestException,
    InternalServerErrorException,
  )
  @UseInterceptors(FileUpload('image'))
  @ApiConsumes('multipart/form-data')
  async createMember(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateMemberRequestDTO,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('Member image is required');
    }

    body.image = file;

    const member = await this.memberService.create(ctx, body);

    return {
      message: 'Member created successfully',
      data: {
        id: member.id,
      },
    };
  }

  /**
   * List all members
   */
  @Get()
  @Require({
    permission: PermissionResource.MEMBER,
    action: PermissionAction.VIEW,
  })
  @Throws(UnauthorizedException, InternalServerErrorException)
  async getAllMembers(
    @Ctx() ctx: RequestContext,
    @Query() query: ListMemberQueryDTO,
  ): Promise<ListMemberResponseDTO> {
    const [members, total] = await this.memberService.findManyMembers(
      ctx,
      query,
    );

    return {
      message: 'Members fetched successfully',
      data: members.map((res) => {
        return {
          id: res.id,
          name: res.name,
          email: res.email,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          phoneNumber: res.phoneNumber,
          designation: res.designation,
          role: res.role,
          image: res.image
            ? {
                id: res.image.id,
                name: res.image.name,
                url: res.image.url,
              }
            : null,
        };
      }),
      pagination: getPaginationResponse(members, total, query),
    };
  }

  /**
   * Update single member
   */
  @Patch(':memberId')
  @Require({
    permission: PermissionResource.MEMBER,
    action: PermissionAction.EDIT,
  })
  @Throws(
    UnauthorizedException,
    ValidationException,
    BadRequestException,
    InternalServerErrorException,
  )
  @UseInterceptors(FileUpload('image'))
  @ApiConsumes('multipart/form-data')
  async updateMember(
    @Ctx() ctx: RequestContext,
    @Param() param: MemberParamDTO,
    @Body() body: UpdateMemberRequestDTO,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    body.image = file || undefined;
    const updatedMember = await this.memberService.updateMember(
      ctx,
      body,
      param.memberId,
    );

    return {
      message: 'Member updated successfully',
      data: {
        id: updatedMember.id,
      },
    };
  }

  /**
   * Member login
   */
  @Post('login')
  @PublicRoute()
  @Throws(
    ValidationException,
    BadRequestException,
    InternalServerErrorException,
  )
  async loginMember(
    @Ctx() ctx: RequestContext,
    @Body() body: MemberLoginDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const member = await this.memberService.loginMember(ctx, body);

    if (!member) throw new NotFoundException('Member not found');

    return {
      message: 'Member logged in successfully',
      data: {
        id: member.id,
      },
    };
  }

  /**
   * Fetch active member
   */
  @Get('active')
  @Require({
    permission: PermissionResource.MEMBER,
    action: PermissionAction.VIEW,
  })
  @Throws(UnauthorizedException, InternalServerErrorException)
  async activeUser(
    @Ctx() ctx: RequestContext,
  ): Promise<SingleMemberResponseDTO> {
    const member = await this.memberService.findSingleMember(
      ctx,
      String(ctx.data?.memberId),
    );

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Active member fetched successfully',
      data: {
        id: member.id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        createdAt: member.createdAt,
        designation: member.designation,
        role: member.role,
        image: member.image
          ? {
              id: member.image.id,
              name: member.image.name,
              url: member.image.url,
            }
          : null,
      },
    };
  }

  /**
   * Member login verify
   */
  @Post('login/verify')
  @PublicRoute()
  @Throws(
    BadRequestException,
    ValidationException,
    InternalServerErrorException,
  )
  async verifyMember(
    @Ctx() ctx: RequestContext,
    @Body() body: MemberVerifyDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifyResponseDTO> {
    const accessToken = await this.memberService.verifyMember(ctx, body);
    attachToken(res, accessToken);

    return {
      message: 'Member verified successfully',
      data: {
        accessToken,
      },
    };
  }

  /**
   * Fetch single member
   */
  @Get(':memberId')
  @Require({
    permission: PermissionResource.MEMBER,
    action: PermissionAction.VIEW,
  })
  @Throws(
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
  )
  async getSingleMember(
    @Ctx() ctx: RequestContext,
    @Param() param: MemberParamDTO,
  ): Promise<SingleMemberResponseDTO> {
    const member = await this.memberService.findSingleMember(
      ctx,
      param.memberId,
    );
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Member fetched  successfully',
      data: {
        id: member.id,
        createdAt: member.createdAt,
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        designation: member.designation,
        role: member.role,
        image: member.image
          ? {
              id: member.image.id,
              name: member.image.name,
              url: member.image.url,
            }
          : null,
      },
    };
  }

  /**
   *Delete single member
   */
  @Delete(':memberId')
  @Require({
    permission: PermissionResource.MEMBER,
    action: PermissionAction.EDIT,
  })
  @Throws(
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
  )
  async deleteMember(
    @Ctx() ctx: RequestContext,
    @Param() param: MemberParamDTO,
  ): Promise<MessageResponseDTO> {
    await this.memberService.deleteMember(ctx, param.memberId);

    return {
      message: 'Member deleted successfully',
    };
  }
}
