import { Entity, Column } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { BaseEntity } from 'common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  constructor(input: DeepPartial<User>) {
    super(input);
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
