import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import {
  ListResponseDTO,
  CreateContactDTO,
  ListContactQueryDTO,
  UpdateContactRequestDTO,
  ContactIdDTO,
  GetSingleContactDTO,
} from './contact.dto';
import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'common/decorator/public.decorator';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';

@Controller('contact')
@ApiTags('Contact Api')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @PublicRoute()
  @Post()
  async createContact(
    @Ctx() ctx: RequestContext,
    @Body() contactDetail: CreateContactDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const contact = await this.contactService.create(ctx, contactDetail);
    return {
      message: 'contact created successfully',
      data: {
        id: contact.id,
      },
    };
  }

  @PublicRoute()
  @Get()
  async getAllContacts(
    @Ctx() ctx: RequestContext,
    @Query() query: ListContactQueryDTO,
  ): Promise<ListResponseDTO> {
    const response = await this.contactService.findMany(ctx, query);
    return {
      message: 'All contact Fetched Properly',
      data: response,
    };
  }

  @PublicRoute()
  @Get('/:contactId')
  async getSingleContact(
    @Ctx() ctx: RequestContext,
    @Param() param: ContactIdDTO,
  ): Promise<GetSingleContactDTO> {
    const contact = await this.contactService.findSingleContact(
      ctx,
      param.contactId,
    );
    return {
      data: contact,
    };
  }

  @PublicRoute()
  @Patch('/:contactId')
  async updateContact(
    @Ctx() ctx: RequestContext,
    @Param() param: ContactIdDTO,
    @Body() contactDetail: UpdateContactRequestDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const contact = await this.contactService.updateContact(
      ctx,
      param.contactId,
      contactDetail,
    );
    return {
      message: 'status updated successfully',
      data: {
        id: contact.id,
      },
    };
  }

  @PublicRoute()
  @Delete('/:contactId')
  async deleteContact(
    @Ctx() ctx: RequestContext,
    @Param() param: ContactIdDTO,
  ): Promise<MessageResponseDTO> {
    const contact = await this.contactService.deleteSingleContact(
      ctx,
      param.contactId,
    );
    return {
      message: 'contact with id removed successfully',
    };
  }
}
