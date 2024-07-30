import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'config/configuration';
import { AssetProvider } from 'common/enum/provider.enum';
import { AssetFor } from 'common/enum/asset.for.enum';
import { AssetLocal } from './provider/asset.local';
import { DataSource } from 'typeorm';
import { Asset } from 'common/entities/asset.entity';
import { AssetProviderInterface } from './provider/asset.provider.interface';

@Injectable()
export class AssetService {
  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly assetLocal: AssetLocal,
    private readonly dataSource: DataSource,
  ) {}

  getProvider(): AssetProviderInterface {
    const assetProvider = this.configService.get('asset', {
      infer: true,
    });
    if (
      assetProvider.Provider.assetProvider ===
      (AssetProvider.LOCAL as AssetProvider)
    ) {
      return new AssetLocal(this.configService);
    }

    throw new Error('No provider found');
  }

  async upload(buffer: Buffer, fileName: string): Promise<Asset | undefined> {
    const provider = this.getProvider();
    const assetFor = AssetFor.CV;

    const uniqueFileName = `${assetFor.toString().toLowerCase()}_${Date.now()}_${fileName}`;
    const { identifier, url } = await provider.upload(buffer, uniqueFileName);

    const assetRepo = this.dataSource.getRepository(Asset);

    const asset = new Asset({
      name: uniqueFileName,
      identifier,
      provider: provider.type,
      size: buffer.length,
      url: url,
      for: assetFor,
    });
    await assetRepo.save(asset);

    return asset;
  }

  async delete(identifier: string): Promise<void> {
    const provider = this.getProvider();
    await provider.delete(identifier);

    const assetRepo = this.dataSource.getRepository(Asset);
    await assetRepo.delete({ identifier: identifier });
  }
}
