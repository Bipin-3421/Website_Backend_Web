import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Vacancy } from './vacancy.entity';
import { Asset } from './asset.entity';
import { ApplicationStatus } from 'common/enum/applicant.status.enum';

@Entity()
export class Applicant extends BaseEntity {
  constructor(input: DeepPartial<Applicant>) {
    super(input);
  }

  @Column({ type: String })
  name: string;

  @Column({ type: String })
  email: string;

  @Column({ type: String })
  phoneNumber: string;

  @Column({ type: String })
  address: string;

  @Column({ type: String, nullable: true })
  githubUrl: string | null;

  @Column({ type: String, nullable: true })
  portfolioUrl: string | null;

  @OneToOne(() => Asset, (asset) => asset.applicant, {
    cascade: true,
  })
  @JoinColumn({ name: 'cvId' })
  cv: Asset;

  @Column({ type: String })
  cvId: string;

  @Column({ type: String, nullable: true })
  referralSource: string | null;

  @Column({ type: Number })
  workExperience: number;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applicants)
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @Column({ type: String })
  vacancyId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
  })
  status: ApplicationStatus;
}
