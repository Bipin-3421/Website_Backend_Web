import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { CreateVacancyReqDto } from './dto/create.vacancy.req.dto';
import { CreateVacancyResDto } from './dto/create.vacancy.res.dto';

@Module({
  imports: [],
  providers: [VacancyService],
  controllers: [VacancyController],
  exports: [],
})
export class VacancyModule {}
