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

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: number;

  @Column()
  address: string;

  @Column({ type: String, nullable: true })
  githubURL: string | null;

  @Column({ type: String, nullable: true })
  portfolioURL: string | null;

  @OneToOne(() => Asset, (asset) => asset.applicant)
  @JoinColumn({ name: 'cv' })
  cv: Asset;

  @Column({ type: String, nullable: true })
  referalSource: string | null;

  @Column()
  workExperience: string;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applicants)
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @Column()
  vacancyId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
  })
  status: ApplicationStatus;
}
