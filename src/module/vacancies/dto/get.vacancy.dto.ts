import { PaginationResponseDTO } from 'common/dto/pagination.dto'
import { JobStatus } from 'common/enum/jobStatus.enum'
import { AssetDTO } from 'common/dto/asset.dto'
import { JobType } from 'common/enum/Job.type.enum'
export class GetVacancyResponseDto {
  message: string

  data: {
    id: string
    name: string
    createdAt: Date
    designationId: string
    jobLevel: string
    salary: string
    skills: string
    experience: number
    jobType: JobType
    datePosted: Date
    deadline: Date
    vacancy: number
    status: JobStatus
    description: string
    image: AssetDTO
  }
}

export class ListVacancyDTO {
  id: string

  name: string

  createdAt: Date

  designation: DesignationDTO

  jobLevel: string

  salary: string

  skills: string

  experience: number

  jobType: JobType

  datePosted: Date

  deadline: Date

  vacancy: number

  status: JobStatus

  description: string

  image: AssetDTO

  applicant: number
}

export class ListVacanciesReponseDto {
  message: string

  data: ListVacancyDTO[]

  pagination: PaginationResponseDTO
}

export class DesignationDTO {
  id: string

  name: string
}
