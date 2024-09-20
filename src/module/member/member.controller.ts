import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  NotAcceptableException,
  UploadedFile,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { RequestContext } from 'common/request-context';
import { Ctx } from 'common/decorator/ctx.decorator';
import { CreateMemberRequestDTO } from './dto/createMember.dto';
import { MessageResponseWithIdDTO } from 'common/dto/response.dto';
import { ApiBadRequestResponse, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IS_PUBLIC } from 'common/constant';
import { PublicRoute } from 'common/decorator/public.decorator';

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
}
