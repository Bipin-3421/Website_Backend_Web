import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { AssetModule } from 'asset/asset.module';

@Module({
  imports: [AssetModule],
  providers: [VacancyService],
  controllers: [VacancyController],
  exports: [],
})
export class VacancyModule {}
