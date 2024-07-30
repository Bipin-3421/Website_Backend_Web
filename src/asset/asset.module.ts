import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetLocal } from './provider/asset.local';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Ensure ConfigModule is imported if ConfigService is used
  providers: [AssetService, AssetLocal], // Register AssetLocal here
  exports: [AssetService], // Export AssetService
})
export class AssetModule {}
