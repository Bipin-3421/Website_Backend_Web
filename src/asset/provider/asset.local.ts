import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'config/configuration';
import * as fs from 'fs';
import { AssetProviderInterface } from './asset.provider.interface';
import { AssetProvider } from 'common/enum/provider.enum';
import * as path from 'path';

@Injectable()
export class AssetLocal implements AssetProviderInterface {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  type = AssetProvider.LOCAL;

  upload(
    buffer: Buffer,
    uniqueFileName: string,
  ): { identifier: string; url: string } {
    const pathToSave = this.configService.get('assetProvider.local.rootPath', {
      infer: true,
    });

    if (!fs.existsSync(pathToSave)) {
      fs.mkdirSync(pathToSave, { recursive: true });
    }

    if (uniqueFileName.includes('.pdf')) {
      uniqueFileName = uniqueFileName.concat('.pdf');
    } else {
      uniqueFileName = uniqueFileName.concat('.png');
    }

    const absoluteFilePath = path.join(pathToSave, uniqueFileName);
    fs.writeFileSync(absoluteFilePath, buffer);

    return { identifier: uniqueFileName, url: absoluteFilePath };
  }

  delete(identifier: string): Promise<boolean> | boolean {
    const filePath = this.configService.get('assetProvider.local.rootPath', {
      infer: true,
    });
    const absoluteFilePath = path.join(filePath, identifier);
    if (!fs.existsSync(absoluteFilePath)) {
      return false;
    }
    fs.unlinkSync(absoluteFilePath);

    return true;
  }
}
