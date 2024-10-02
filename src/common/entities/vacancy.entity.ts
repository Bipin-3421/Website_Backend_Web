import { JobType } from 'common/enum/Job.type.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { BaseEntity } from './base.entity';
import { Applicant } from './applicant.entity';
import { Asset } from './asset.entity';
import { JobStatus } from 'common/enum/jobStatus.enum';
import { Designation } from './designation.entity';

@Entity()
export class Vacancy extends BaseEntity {
  constructor(input: DeepPartial<Vacancy>) {
    super(input);
  }

  @Column({ type: String })
  name: string;

  @OneToOne(() => Designation, (designation) => designation.vacacy)
  @JoinColumn({ name: 'designationId' })
  designation: Designation;

  @Column({ type: String })
  designationId: string;

  @Column({ type: String })
  jobLevel: string;

  @Column({ type: String })
  salary: string;

  @Column({ type: String })
  skills: string;

  @Column({ type: String })
  experience: number;

  @Column({ type: 'enum', enum: JobType })
  jobType: JobType;

  @Column({ type: 'timestamp with time zone' })
  datePosted: Date;

  @Column({ type: 'timestamp with time zone' })
  deadline: Date;

  @Column({ type: Number })
  vacancyOpening: number;

  @Column({ type: String, default: '' })
  description: string;

  @Column({
    type: 'enum',
    enumName: 'JobStatus',
    enum: JobStatus,
  })
  status: JobStatus;

  @OneToMany(() => Applicant, (Applicant) => Applicant.vacancy)
  applicants: Applicant[];

  @OneToOne(() => Asset, (asset) => asset.vacancy)
  @JoinColumn({ name: 'imageId' })
  image: Asset;

  @Column({ type: String })
  imageId: string;
}
