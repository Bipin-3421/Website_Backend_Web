import { Entity, Column, DeepPartial } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ContactStatus } from 'common/enum/contactStatus.enum';

@Entity()
export class Contact extends BaseEntity {
  constructor(data?: DeepPartial<Contact>) {
    super(data);
  }

  @Column({ type: String })
  name: string;

  @Column({ type: String })
  email: string;

  @Column({ type: String })
  phoneNumber: string;

  @Column({ type: String })
  message: string;

  @Column({
    type: 'enum',
    enumName: 'ContactStatus',
    enum: ContactStatus,
    default: ContactStatus.UNREAD,
  })
  status: ContactStatus;
}
