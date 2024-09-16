import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Ctx } from 'common/decorator/ctx.decorator';
import { RequestContext } from 'common/request-context';
import {
  ListResponseDTO,
  SingleContactResponseDTO,
  CreateContactDTO,
} from './contact.dto';
import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'common/decorator/public.decorator';
import { MessageResponseWithIdDTO } from 'common/dto/response.dto';

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
  async getAllContacts(@Ctx() ctx: RequestContext): Promise<ListResponseDTO> {
    const response = await this.contactService.findMany(ctx);
    return {
      message: 'All contact Fetched Properly',
      data: response,
    };
  }

  @PublicRoute()
  @Get('/:contactID')
  async getSingleContact(
    @Ctx() ctx: RequestContext,
    @Param('contactID') id: string,
  ) {
    const contact = await this.contactService.findSingleContact(ctx, id);
    return {
      contact,
    };
  }

  @PublicRoute()
  @Delete('/:contactID')
  async deleteContact(
    @Ctx() ctx: RequestContext,
    @Param('contactId') id: string,
  ) {
    const contact = await this.contactService.deleteSingleContact(ctx, id);
    return {
      message: 'contact with id removed successfully',
    };
  }
}
