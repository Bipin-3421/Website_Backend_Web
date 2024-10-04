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
  ListContactResponseDTO,
  CreateContactDTO,
  ListContactQueryDTO,
  UpdateContactRequestDTO,
  ContactIdDTO,
  GetContactResponseDTO,
} from './contact.dto';
import { ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { PublicRoute } from 'common/decorator/public.decorator';
import {
  MessageResponseDTO,
  MessageResponseWithIdDTO,
} from 'common/dto/response.dto';
import { getPaginationResponse } from 'common/utils/pagination.utils';
import { Require } from 'common/decorator/require.decorator';
import { PermissionAction, PermissionResource } from 'types/permission';

@Controller('contact')
@ApiTags('Contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Create a new contact
   */
  @Post()
  @PublicRoute()
  @ApiBadRequestResponse({
    description: 'Contact creation failed',
  })
  async createContact(
    @Ctx() ctx: RequestContext,
    @Body() body: CreateContactDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const contact = await this.contactService.create(ctx, body);
    return {
      message: 'Contact created successfully',
      data: {
        id: contact.id,
      },
    };
  }

  /**
   * List all contacts
   */
  @Get()
  @Require({
    permission: PermissionResource.CONTACT,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Contacts fetch failed',
  })
  async getAllContacts(
    @Ctx() ctx: RequestContext,
    @Query() query: ListContactQueryDTO,
  ): Promise<ListContactResponseDTO> {
    const [response, total] = await this.contactService.findMany(ctx, query);
    return {
      message: 'Contacts fetched successfully',
      data: response.map((res) => {
        return {
          id: res.id,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
          name: res.name,
          email: res.email,
          phoneNumber: res.phoneNumber,
          message: res.message,
          status: res.status,
        };
      }),
      pagination: getPaginationResponse(response, total, query),
    };
  }

  /**
   * Fetch single contact
   */
  @Get('/:contactId')
  @Require({
    permission: PermissionResource.CONTACT,
    action: PermissionAction.VIEW,
  })
  @ApiBadRequestResponse({
    description: 'Single contact fetch failed',
  })
  async getSingleContact(
    @Ctx() ctx: RequestContext,
    @Param() param: ContactIdDTO,
  ): Promise<GetContactResponseDTO> {
    const contact = await this.contactService.findSingleContact(
      ctx,
      param.contactId,
    );
    return {
      message: 'Contact fetched successfully',
      data: {
        id: contact.id,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        name: contact.name,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        message: contact.message,
        status: contact.status,
      },
    };
  }

  /**
   * Update single contact
   */
  @Patch('/:contactId')
  @Require({
    permission: PermissionResource.CONTACT,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Contact updation failed',
  })
  async updateContact(
    @Ctx() ctx: RequestContext,
    @Param() param: ContactIdDTO,
    @Body() body: UpdateContactRequestDTO,
  ): Promise<MessageResponseWithIdDTO> {
    const contact = await this.contactService.updateContact(
      ctx,
      param.contactId,
      body,
    );
    return {
      message: 'Contact updated successfully',
      data: {
        id: contact.id,
      },
    };
  }

  /**
   * Delete single contact
   */
  @Delete('/:contactId')
  @Require({
    permission: PermissionResource.CONTACT,
    action: PermissionAction.EDIT,
  })
  @ApiBadRequestResponse({
    description: 'Contact deletion failed',
  })
  async deleteContact(
    @Ctx() ctx: RequestContext,
    @Param() param: ContactIdDTO,
  ): Promise<MessageResponseDTO> {
    const contact = await this.contactService.deleteSingleContact(
      ctx,
      param.contactId,
    );
    return {
      message: 'Contact deleted successfully',
    };
  }
}
