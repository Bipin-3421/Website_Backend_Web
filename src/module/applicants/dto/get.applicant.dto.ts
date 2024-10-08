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
    githubUrl: string | null
    portfolioUrl: string | null
    referralSource: string | null
    workExperience: number
    vacancyId: string
    status: ApplicationStatus
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

  status: ApplicationStatus
}

export class ListApplicantsResponseDto {
  message: string

  data: SingleApplicantDTO[]

  pagination: PaginationResponseDTO
}
