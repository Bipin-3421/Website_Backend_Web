import { MemberRole } from 'common/enum/memberRole.enum'
import {
  Entity,
  Column,
  DeepPartial,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { Asset } from './asset.entity'
import { Activity } from './activity.entity'

@Entity()
export class Member extends BaseEntity {
  constructor(data?: DeepPartial<Member>) {
    super(data)
  }

  @Column({ type: String })
  name: string

  @Column({ type: String, unique: true })
  email: string

  @Column({ type: String, unique: true })
  phoneNumber: string

  @Column({ type: String })
  designation: string

  @Column({
    type: 'enum',
    enumName: 'MemberRole',
    enum: MemberRole
  })
  role: MemberRole

  @OneToOne(() => Asset, (asset) => asset.member, {
    nullable: true
  })
  @JoinColumn({ name: 'imageId' })
  image: Asset | null

  @Column({ nullable: true })
  imageId: string

  @OneToMany(() => Activity, (activity) => activity.member)
  activities: Activity[]
}
