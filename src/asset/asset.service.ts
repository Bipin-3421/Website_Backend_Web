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
    private readonly dataSource: DataSource,
  ) {}

  getProvider(provider?: string): AssetProviderInterface {
    const assetProvider =
      provider ||
      this.configService.get('asset', {
        infer: true,
      }).Provider.assetProvider;
    if (assetProvider === AssetProvider.LOCAL) {
      return new AssetLocal(this.configService);
    }

    throw new Error('No provider found');
  }

  async upload(buffer: Buffer): Promise<Asset | undefined> {
    const provider = this.getProvider();
    const assetFor = AssetFor.CV;

    const uniqueFileName = `${assetFor.toString().toLowerCase()}_${Date.now()}`;
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

  async delete(id: string): Promise<boolean> {
    const assetRepo = this.dataSource.getRepository(Asset);

    const asset = await assetRepo.findOne({
      where: { id: id },
    });

    if (!asset) {
      return false;
    }

    const provider = this.getProvider(asset.provider);
    await provider.delete(asset.identifier);

    await assetRepo.delete({ id: id });

    return true;
  }
}
