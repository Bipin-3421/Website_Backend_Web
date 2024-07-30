import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'config/configuration';
import * as fs from 'fs';
import { AssetProviderInterface } from './asset.provider.interface';
import { AssetProvider } from 'common/enum/provider.enum';

@Injectable()
export class AssetLocal implements AssetProviderInterface {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  type = AssetProvider.LOCAL;

  upload(
    buffer: Buffer,
    uniqueFileName: string,
  ): { identifier: string; url: string } {
    const pathToSave = this.configService.get('asset.local.rootPath', {
      infer: true,
    });

    if (!fs.existsSync(pathToSave)) {
      fs.mkdirSync(pathToSave, { recursive: true });
    }

    fs.writeFileSync(`${pathToSave}/${uniqueFileName}`, buffer);
    const absolutefilePath = `${pathToSave}/${uniqueFileName}`;

    return { identifier: uniqueFileName, url: absolutefilePath };
  }

  delete(identifier: string): Promise<boolean> | boolean {
    if (!fs.existsSync(`${process.env.FILE_UPLOAD_PATH}/${identifier}`)) {
      return false;
    }
    fs.unlinkSync(`${process.env.FILE_UPLOAD_PATH}/${identifier}`);

    return true;
  }
}
