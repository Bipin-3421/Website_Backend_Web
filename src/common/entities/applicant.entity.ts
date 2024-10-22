import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { Vacancy } from './vacancy.entity'
import { Asset } from './asset.entity'
import { ApplicationStatus } from 'common/enum/applicant.status.enum'
import { Designation } from './designation.entity'
import { Activity } from './activity.entity'

@Entity()
export class Applicant extends BaseEntity {
  constructor(input: DeepPartial<Applicant>) {
    super(input)
  }

  @Column({ type: String })
  name: string

  @Column({ type: String })
  email: string

  @Column({ type: String })
  phoneNumber: string

  @Column({ type: String })
  address: string

  @Column({ type: String, nullable: true })
  githubUrl: string | null

  @Column({ type: String, nullable: true })
  portfolioUrl: string | null

  @ManyToOne(() => Designation, (designation) => designation.applicant)
  @JoinColumn({ name: 'designationId' })
  designation: Designation

  @Column({ type: String })
  designationId: string

  @OneToOne(() => Asset, (asset) => asset.applicant, {
    cascade: true
  })
  @JoinColumn({ name: 'cvId' })
  cv: Asset

  @Column({ type: String })
  cvId: string

  @Column({ type: String, nullable: true })
  referralSource: string | null

  @Column({ type: Number })
  workExperience: number

  @Column({ type: String })
  position: string

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applicants)
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy

  @Column({ type: String })
  vacancyId: string

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus'
  })
  status: ApplicationStatus

  @Column({
    type: Number,
    nullable: true
  })
  expectedSalary: number

  @OneToMany(() => Activity, (activity) => activity.applicant)
  activity: Activity[]
}
