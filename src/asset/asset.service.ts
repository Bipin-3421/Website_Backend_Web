import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from 'config/configuration'
import { AssetProvider } from 'common/enum/provider.enum'
import { AssetFor } from 'common/enum/asset.for.enum'
import { AssetLocal } from './provider/asset.local'
import { Asset } from 'common/entities/asset.entity'
import { AssetProviderInterface } from './provider/asset.provider.interface'
import { TransactionalConnection } from 'module/connection/connection.service'
import { RequestContext } from 'common/request-context'
import { AzureBlobStorageProvider } from './provider/azure.provider'

@Injectable()
export class AssetService {
  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly connection: TransactionalConnection
  ) {}

  getProvider(provider?: string): AssetProviderInterface {
    const assetProvider =
      provider ||
      this.configService.get('assetProvider.name', {
        infer: true
      })
    if (assetProvider === AssetProvider.LOCAL) {
      return new AssetLocal(this.configService)
    } else if (assetProvider === AssetProvider.AZURE) {
      return new AzureBlobStorageProvider(this.configService)
    } else {
      throw new Error('No provider found')
    }
  }

  async upload(
    ctx: RequestContext,
    buffer: Buffer,
    assetFor: AssetFor
  ): Promise<Asset> {
    const assetRepo = this.connection.getRepository(ctx, Asset)
    const provider = this.getProvider()

    const uniqueFileName = `${assetFor.toString().toLowerCase()}_${Date.now()}`
    const { identifier, url } = await provider.upload(buffer, uniqueFileName)

    const asset = new Asset({
      name: uniqueFileName,
      identifier,
      provider: provider.type,
      size: buffer.length,
      url: url,
      for: assetFor
    })
    await assetRepo.save(asset)

    return asset
  }

  async delete(ctx: RequestContext, id: string): Promise<boolean> {
    const assetRepo = this.connection.getRepository(ctx, Asset)

    const asset = await assetRepo.findOne({
      where: { id: id }
    })

    if (!asset) {
      return false
    }

    const provider = this.getProvider(asset.provider)
    await provider.delete(asset.identifier)

    await assetRepo.delete({ id: id })

    return true
  }
}
