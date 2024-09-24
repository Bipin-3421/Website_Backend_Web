import { DeepPartial, Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Designation } from './designation.entity';

@Entity()
export class Department extends BaseEntity {
  constructor(data?: DeepPartial<Department>) {
    super(data);
  }

  @Column({ type: String })
  name: string;

  @OneToMany(() => Designation, (designation) => designation.department)
  designation: Designation[];
}
