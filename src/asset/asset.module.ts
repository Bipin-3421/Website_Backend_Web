import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';

@Module({
  imports: [],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
