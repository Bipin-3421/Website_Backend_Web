import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamp } from 'typeorm/driver/mongodb/bson.typings';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Entity()
export abstract class BaseEntity {
  //deep partial is a type that allows you to create a new type based on an existing type where all the properties are optional
  protected constructor(input?: DeepPartial<BaseEntity>) {
    if (input) {
      for (const [key, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(input),
      )) {
        if (descriptor.get && !descriptor.set) {
          continue;
        }
        (this as any)[key] = descriptor.value;
      }
    }
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Timestamp;
}
