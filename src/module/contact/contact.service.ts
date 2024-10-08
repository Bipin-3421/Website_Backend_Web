import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from 'common/request-context';
import {
  CreateContactDTO,
  ListContactQueryDTO,
  UpdateContactRequestDTO,
} from './contact.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Contact } from 'common/entities/contact.entity';
import { FindOptionsWhere, ILike } from 'typeorm';
import { patchEntity } from 'common/utils/patchEntity';
import { dateFilter } from 'common/utils/dateFilter';

@Injectable()
export class ContactService {
  constructor(private readonly connection: TransactionalConnection) {}

  async create(ctx: RequestContext, body: CreateContactDTO) {
    const contact = new Contact({
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      message: body.message,
    });
    const contactRepo = this.connection.getRepository(ctx, Contact);
    
return await contactRepo.save(contact);
  }

  async findMany(
    ctx: RequestContext,
    filters: ListContactQueryDTO,
  ): Promise<[Contact[], number]> {
    const { search, take = 10, page = 0 } = filters;
    const skip = (take || 0) * (page || 0);
    const whereClause: FindOptionsWhere<Contact>[] = [
      {
        name: search ? ILike(`%${search}%`) : undefined,
        createdAt: dateFilter(filters.dateFrom, filters.dateTo),
      },
      {
        email: search ? ILike(`%${search}%`) : undefined,
        createdAt: dateFilter(filters.dateFrom, filters.dateTo),
      },
      {
        status: filters.status,
      },
    ];
    
return this.connection.getRepository(ctx, Contact).findAndCount({
      where: whereClause.length ? whereClause : undefined,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findSingleContact(ctx: RequestContext, contactId: string) {
    const contactRepo = this.connection.getRepository(ctx, Contact);
    const data = await contactRepo.findOne({
      where: {
        id: contactId,
      },
    });
    if (!data) {
      throw new NotFoundException('Contact  not found');
    }
    
return data;
  }

  async updateContact(
    ctx: RequestContext,
    contactId: string,
    detail: UpdateContactRequestDTO,
  ) {
    const contactRepo = this.connection.getRepository(ctx, Contact);
    const contact = await this.findSingleContact(ctx, contactId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    patchEntity(contact, detail);
    
return await contactRepo.save(contact);
  }

  async deleteSingleContact(ctx: RequestContext, contactId: string) {
    const contactRepo = this.connection.getRepository(ctx, Contact);
    const contact = await contactRepo.findOne({
      where: {
        id: contactId,
      },
    });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    
return await contactRepo.remove(contact);
  }
}
