import { JobType } from 'common/enum/Job.type.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { BaseEntity } from './base.entity';
import { Applicant } from './applicant.entity';

@Entity()
export class Vacany extends BaseEntity {
  constructor(input: DeepPartial<Vacany>) {
    super(input);
  }

  @Column()
  designation: string;

  @Column()
  position: string;

  @Column()
  datePosted: Date;

  @Column()
  deadline: Date;

  @Column()
  salary: string;

  @Column()
  experience: number;

  @Column({ type: 'enum', enum: JobType })
  jobType: JobType;

  @Column()
  openingPosition: number;

  @OneToMany(() => Applicant, (Applicant) => Applicant.vacany)
  applicants: Applicant[];
}
