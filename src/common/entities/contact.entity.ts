import { Entity, Column, DeepPartial } from 'typeorm';
import { BaseEntity } from './base.entity';
import { jobStatus } from 'common/enum/jobStatus.enum';

@Entity()
export class Contact extends BaseEntity {
  constructor(data?: DeepPartial<Contact>) {
    super(data);
  }

  @Column({ type: String })
  name: string;

  @Column({ type: String, unique: true })
  email: string;

  @Column({ type: String, unique: true })
  phoneNumber: string;

  @Column({ type: String })
  message: string;

  @Column({ type: 'enum', enum: jobStatus, default: jobStatus.ACTIVE })
  status: jobStatus;
}
