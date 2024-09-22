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
import { PublicRoute } from 'common/decorator/public.decorator';
import {
  CreateMemberRequestDTO,
  ListMemberResponseDTO,
  ListMemberQueryDTO,
  MemberParamDTO,
  UpdateMemberRequestDTO,
} from './member.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';

@Controller('member')
@ApiTags('Member API')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @PublicRoute()
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
    description: 'member creation failed',
  })
  @ApiConsumes('multipart/form-data')
  async createMember(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateMemberRequestDTO,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<MessageResponseWithIdDTO> {
    if (!file || file.size == 0) {
      throw new NotAcceptableException('Vacancy image is required');
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

  @PublicRoute()
  @Get()
  async getAllMembers(
    @Ctx() ctx: RequestContext,
    @Query() query: ListMemberQueryDTO,
  ): Promise<ListMemberResponseDTO> {
    const [response, total] = await this.memberService.findManyMembers(
      ctx,
      query,
    );
    return {
      message: 'Members fetched successfully',
      data: response.map((res) => {
        return {
          id: res.id,
          name: res.name,
          email: res.email,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          phoneNumber: res.phoneNumer,
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
      pagination: getPaginationResponse(response, total, query),
    };
  }
  @PublicRoute()
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
      message: 'Member edited successfully',
      data: {
        id: updatedMember.id,
      },
    };
  }

  @PublicRoute()
  @Delete(':memberId')
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
}
