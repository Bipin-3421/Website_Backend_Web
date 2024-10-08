import { Column, DeepPartial, Entity, OneToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { AssetFor } from 'common/enum/asset.for.enum'
import { AssetProvider } from 'common/enum/provider.enum'
import { Applicant } from './applicant.entity'
import { Vacancy } from './vacancy.entity'
import { Member } from './member.entity'
import { Designation } from './designation.entity'

@Entity()
export class Asset extends BaseEntity {
  constructor(input: DeepPartial<Asset>) {
    super(input)
  }

  @Column()
  name: string

  @Column()
  identifier: string

  @Column({ type: 'enum', enum: AssetProvider })
  provider: AssetProvider

  @Column()
  size: number

  @Column()
  url: string

  @Column({ type: 'enum', enum: AssetFor })
  for: AssetFor

  @OneToOne(() => Applicant, (applicant) => applicant.cv)
  applicant: Applicant

  @OneToOne(() => Vacancy, (vacancy) => vacancy.image)
  vacancy: Vacancy

  @OneToOne(() => Member, (member) => member.image)
  member: Member

  @OneToOne(() => Designation, (designation) => designation.image)
  designation: Designation
}
