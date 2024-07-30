import { AssetProvider } from 'common/enum/provider.enum';

export interface AssetProviderInterface {
  readonly type: AssetProvider;

  upload(
    buffer: Buffer,
    fileName: string,
  ):
    | Promise<{ identifier: string; url: string }>
    | { identifier: string; url: string };

  delete(identifier: string): Promise<boolean> | boolean;
}
