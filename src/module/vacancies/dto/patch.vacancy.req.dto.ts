import { JobType } from '../../../common/enum/Job.type.enum';

export class PatchVacancyReqDto {
  designation: string | undefined;

  position: string | undefined;

  datePosted: Date | undefined;

  deadline: Date | undefined;

  salary: string | undefined;

  experience: number | undefined;

  jobType: JobType | undefined;

  openingPosition: number | undefined;
}
