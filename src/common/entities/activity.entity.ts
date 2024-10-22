import { Column, DeepPartial, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { Applicant } from './applicant.entity'
import { Member } from './member.entity'

@Entity()
export class Activity extends BaseEntity {
  constructor(input: DeepPartial<Activity>) {
    super(input)
  }

  @Column({ type: String, default: '' })
  comment: string

  @Column({ type: String, default: '' })
  history: string

  @ManyToOne(() => Applicant, (applicant) => applicant.activity)
  @JoinColumn({ name: 'applicantId' })
  applicant: Applicant

  @Column({ type: String })
  applicantId: string

  @ManyToOne(() => Member, (member) => member.activities)
  member: Member

  @JoinColumn({ name: 'memberId' })
  @Column({ type: String })
  memberId: string
}
