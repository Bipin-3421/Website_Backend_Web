import { Column, DeepPartial, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Vacany } from './vacany.entity';

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
  Address: string;

  @Column()
  githubURL: string;

  @Column()
  portfolioURL: string;

  @Column()
  CV: string;

  @Column({ nullable: true })
  referalSource: string;

  @Column()
  workExperience: string;

  @ManyToOne(() => Vacany, (Vacany) => Vacany.applicants)
  vacany: Vacany;
}
