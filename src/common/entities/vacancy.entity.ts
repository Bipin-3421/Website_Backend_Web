import { JobType } from 'common/enum/Job.type.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { BaseEntity } from './base.entity';
import { Applicant } from './applicant.entity';
import { Asset } from './asset.entity';
import { JobStatus } from 'common/enum/jobStatus.enum';

@Entity()
export class Vacancy extends BaseEntity {
  constructor(input: DeepPartial<Vacancy>) {
    super(input);
  }

  @Column({ length: 50 })
  designation: string;

  @Column()
  position: string;

  @Column({ type: 'timestamp with time zone' })
  datePosted: Date;

  @Column({ type: 'timestamp with time zone' })
  deadline: Date;

  @Column()
  experience: number;

  @Column({ type: 'enum', enum: JobType })
  jobType: JobType;

  @Column()
  openingPosition: number;

  @Column()
  department: string;

  @Column({ length: 200 })
  skill: string;

  @Column({ length: 200 })
  description: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
  })
  status: JobStatus;

  @OneToMany(() => Applicant, (Applicant) => Applicant.vacancy)
  applicants: Applicant[];

  @OneToOne(() => Asset, (asset) => asset.vacancy, {
    cascade: true,
  })
  @JoinColumn({ name: 'imageId' })
  image: Asset;

  @Column()
  imageId: string;
}
