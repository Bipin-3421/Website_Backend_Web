import { Module } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { AssetModule } from 'asset/asset.module';

@Module({
  imports: [AssetModule],
  controllers: [DesignationController],
  providers: [DesignationService],
})
export class DesignationModule {}
