import { AssetProviderInterface } from './asset.provider.interface';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfig } from 'config/configuration';
import { AssetProvider } from 'common/enum/provider.enum';

@Injectable()
export class AzureBlobStorageProvider implements AssetProviderInterface {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}
  readonly type: AssetProvider = AssetProvider.AZURE;

  async upload(
    buffer: Buffer,
    fileName: string,
  ): Promise<{ identifier: string; url: string }> {
    const assetProviderConfig = this.configService.get('assetProvider', {
      infer: true,
    });
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      assetProviderConfig.azure.connectionString,
    );
    const containerClient = blobServiceClient.getContainerClient(
      assetProviderConfig.azure.containerName,
    );
    const blobName = fileName;
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: 'image/png' },
    });

    return { identifier: blobClient.name, url: blobClient.url };

    // return `https://${assetProviderConfig.azure.container_name}.blob.core.windows.net/restroxbeta/${fileName}`
  }

  async delete(identifier: string): Promise<boolean> {
    try {
      const assetProviderConfig = this.configService.get('assetProvider', {
        infer: true,
      });
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        assetProviderConfig.azure.connectionString,
      );
      const containerClient = blobServiceClient.getContainerClient(
        assetProviderConfig.azure.containerName,
      );
      const blobClient = containerClient.getBlockBlobClient(identifier);
      await blobClient.delete();

      return true;
    } catch (error) {
      console.error(error);
      Logger.error(
        'Error deleting file from azure',
        'AzureBlobStorageProvider',
      );

      return false;
    }
  }
}
