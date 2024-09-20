import { MemberRole } from 'common/enum/memberRole.enum';
import { Entity, Column, DeepPartial, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Asset } from './asset.entity';

@Entity()
export class Member extends BaseEntity {
  constructor(data?: DeepPartial<Member>) {
    super(data);
  }

  @Column({ type: String })
  name: string;

  @Column({ type: String })
  email: string;

  @Column({ type: String })
  phoneNumer: string;

  @Column({ type: String })
  designation: string;

  @Column({
    type: 'enum',
    enumName: 'MemberRole',
    enum: MemberRole,
  })
  role: MemberRole;

  @OneToOne(() => Asset, (asset) => asset.member, {
    cascade: true,
  })
  @JoinColumn({ name: 'imageId' })
  image: Asset;

  @Column()
  imageId: string;
}
