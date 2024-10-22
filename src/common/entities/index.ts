import { Activity } from './activity.entity'
import { Applicant } from './applicant.entity'
import { Asset } from './asset.entity'
import { Contact } from './contact.entity'
import { Department } from './department.entity'
import { Designation } from './designation.entity'
import { Member } from './member.entity'
import { Vacancy } from './vacancy.entity'

const AllEntities = [
  Applicant,
  Vacancy,
  Asset,
  Contact,
  Member,
  Department,
  Designation,
  Activity
]

export { AllEntities }
