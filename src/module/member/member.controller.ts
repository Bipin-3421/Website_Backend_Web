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
} from '@nestjs/common';
import { MemberService } from './member.service';
import { RequestContext } from 'common/request-context';
import { Ctx } from 'common/decorator/ctx.decorator';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateMemberRequestDTO,
  ListMemberResponseDTO,
  ListMemberQueryDTO,
  MemberParamDTO,
  UpdateMemberRequestDTO,
  MemberLoginDTO,
  MemberVerifyDTO,
} from './member.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';

@Controller('member')
@ApiTags('Member API')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(req, file, callback) {
        const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!MIME_TYPES.includes(file.mimetype)) {
          callback(
            new NotAcceptableException('WEBP,SVG,JPG,PNG files are allowed'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiBadRequestResponse({
    description: 'Member creation failed',
  })
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

  @Get()
  @ApiBadRequestResponse({
    description: 'Members  fetch failed',
  })
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
          image: {
            id: res.image.id,
            name: res.image.name,
            url: res.image.url,
          },
          imageId: res.imageId,
        };
      }),
      pagination: getPaginationResponse(members, total, query),
    };
  }

  @Patch(':memberId')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(req, file, callback) {
        const MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!MIME_TYPES.includes(file.mimetype)) {
          callback(
            new NotAcceptableException('WEBP,SVG,JPG,PNG files are allowed'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiBadRequestResponse({
    description: 'Member updation failed',
  })
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

  @Delete(':memberId')
  @ApiBadRequestResponse({
    description: 'Member deletion failed',
  })
  async deleteMember(
    @Ctx() ctx: RequestContext,
    @Param() param: MemberParamDTO,
  ): Promise<MessageResponseDTO> {
    const deletedMember = await this.memberService.deleteMember(
      ctx,
      param.memberId,
    );
    return {
      message: 'Member deleted successfully',
    };
  }

  @Post('login')
  @ApiBadRequestResponse({
    description: 'Member logged in failed',
  })
  async loginMember(
    @Ctx() ctx: RequestContext,
    @Body() body: MemberLoginDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const member = await this.memberService.loginMember(ctx, body);

    return {
      message: 'Member logged in successfully',
      data: {
        id: member.id,
      },
    };
  }

  @Post('login/verify')
  async verifyMember(
    @Ctx() ctx: RequestContext,
    @Body() body: MemberVerifyDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const member = await this.memberService.verifyMember(ctx, body);

    return {
      message: 'Member verified successfully',
      data: {
        id: member.id,
      },
    };
  }
}
