import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { AssetService } from 'asset/asset.service';

@Module({
  imports: [],
  providers: [VacancyService, AssetService],
  controllers: [VacancyController],
  exports: [],
})
export class VacancyModule {}
