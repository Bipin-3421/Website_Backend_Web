import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from 'common/request-context';
import { CreateContactDTO } from './contact.dto';
import { TransactionalConnection } from 'module/connection/connection.service';
import { Contact } from 'common/entities/contact.entity';

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

  async findMany(ctx: RequestContext) {
    const contactRepo = this.connection.getRepository(ctx, Contact);
    const data = await contactRepo.find({});
    return data;
  }

  async findSingleContact(ctx: RequestContext, contactID: string) {
    const contactRepo = this.connection.getRepository(ctx, Contact);
    const data = await contactRepo.findOne({
      where: {
        id: contactID,
      },
    });
    if (!data) {
      throw new NotFoundException('contact with given id is not found');
    }
    return data;
  }

  async deleteSingleContact(ctx: RequestContext, contactID: string) {
    const contactRepo = this.connection.getRepository(ctx, Contact);
    const contact = await contactRepo.findOne({
      where: {
        id: contactID,
      },
    });
    if (!contact) {
      throw new NotFoundException('contact with given id is not found');
    }
    return await contactRepo.remove(contact);
  }
}
