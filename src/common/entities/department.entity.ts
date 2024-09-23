import { DeepPartial, Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Department extends BaseEntity {
  constructor(data?: DeepPartial<Department>) {
    super(data);
  }

  @Column({ type: String })
  department: string;
}
