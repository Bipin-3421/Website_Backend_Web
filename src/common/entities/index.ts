import { Applicant } from './applicant.entity';
import { Asset } from './asset.entity';
import { Contact } from './contact.entity';
import { Department } from './department.entity';
import { Member } from './member.entity';
import { User } from './user.entity';
import { Vacancy } from './vacancy.entity';

const allEntities = [
  Applicant,
  User,
  Vacancy,
  Asset,
  Contact,
  Member,
  Department,
];

export { allEntities };
