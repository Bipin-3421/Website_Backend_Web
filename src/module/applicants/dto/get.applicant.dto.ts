import { AssetDTO } from 'common/dto/asset.dto'
import { PaginationResponseDTO } from 'common/dto/pagination.dto'
import { ApplicationStatus } from 'common/enum/applicant.status.enum'

export class SingleApplicantResponseDTO {
  message: string

  data: {
    id: string
    name: string
    email: string
    phoneNumber: string
    address: string
    createdAt: Date
    cvId: string
    position: string
    designationId: string
    githubUrl: string | null
    portfolioUrl: string | null
    referralSource: string | null
    workExperience: number
    vacancyId: string
    status: ApplicationStatus
    activity: ActivityDTO[]
  }
}

export class SingleApplicantDTO {
  id: string

  name: string

  email: string

  phoneNumber: string

  address: string

  createdAt: Date

  cv: AssetDTO

  githubUrl: string | null

  portfolioUrl: string | null

  referralSource: string | null

  workExperience: number

  vacancyId: string

  position: string

  designation: DesignationDTO

  status: ApplicationStatus
}

export class ListApplicantsResponseDTO {
  message: string

  data: SingleApplicantDTO[]

  pagination: PaginationResponseDTO
}

export class DesignationDTO {
  id: string

  name: string
}

export class ActivityDTO {
  id: string

  createdAt: Date

  comment: string
}
