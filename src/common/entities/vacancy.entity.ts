import { JobType } from 'common/enum/Job.type.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { BaseEntity } from './base.entity';
import { Applicant } from './applicant.entity';

@Entity()
export class Vacancy extends BaseEntity {
  constructor(input: DeepPartial<Vacancy>) {
    super(input);
  }

  @Column()
  designation: string;

  @Column()
  position: string;

  @Column({ type: 'timestamp with time zone' })
  datePosted: Date;

  @Column({ type: 'timestamp with time zone' })
  deadline: Date;

  @Column()
  salary: string;

  @Column()
  experience: number;

  @Column({ type: 'enum', enum: JobType })
  jobType: JobType;

  @Column()
  openingPosition: number;

  @OneToMany(() => Applicant, (Applicant) => Applicant.vacancy)
  applicants: Applicant[];
}
