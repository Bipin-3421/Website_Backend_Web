import { IsString } from 'class-validator';

import { Optional } from 'common/decorator/optional.decorator';

export class SearchParamDTO {
  @IsString()
  @Optional()
  search: string | undefined;
}
