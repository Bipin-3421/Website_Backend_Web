import { AssetProvider } from 'common/enum/provider.enum';

export interface AppConfig {
  port: number;
  database: {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
  };
  asset: {
    Provider: {
      assetProvider: AssetProvider;
    };
    local: {
      rootPath: string;
    };
  };
  jwt: {
    jwtSecret: string;
    jwtTimeOut: string;
  };
}

export default () => {
  const config: AppConfig = {
    port: parseInt(process.env.PORT ?? '3000'),
    database: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'a2004',
      database: process.env.DATABASE_NAME ?? 'testDB',
    },
    asset: {
      Provider: {
        assetProvider: (process.env.ASSET_PROVIDER ??
          AssetProvider.LOCAL) as AssetProvider,
      },
      local: {
        rootPath: process.env.FILE_UPLOAD_PATH ?? 'uploads',
      },
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET ?? '',
      jwtTimeOut: process.env.JWT_TIMEOUT ?? '',
    },
  };

  return config;
};
