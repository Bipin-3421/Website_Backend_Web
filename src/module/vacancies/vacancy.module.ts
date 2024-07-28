import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';

@Module({
  imports: [],
  providers: [VacancyService],
  controllers: [VacancyController],
  exports: [],
})
export class VacancyModule {}
