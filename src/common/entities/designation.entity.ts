import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Department } from './department.entity';
import { Asset } from './asset.entity';

@Entity()
export class Designation extends BaseEntity {
  constructor(data?: DeepPartial<Designation>) {
    super(data);
  }

  @Column({ type: String })
  name: string;

  @ManyToOne(() => Department, (department) => department.designation)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column()
  departmentId: string;

  @OneToOne(() => Asset, (asset) => asset.designation)
  @JoinColumn({ name: 'imageId' })
  image: Asset;

  @Column()
  imageId: string;

  @Column({ type: String, nullable: true })
  description: string | null;
}
