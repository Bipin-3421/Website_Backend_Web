import { Module } from '@nestjs/common';
import configuration, { AppConfig } from 'config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'module/auth/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtServiceImpl } from 'common/guard/jwt.guard';
import { allEntities } from 'common/entities';
import { VacancyModule } from 'module/vacancies/vacancy.module';
import { AssetModule } from 'asset/asset.module';
import { ApplicantModule } from './module/applicants/applicant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const dbConfig = configService.get('database', { infer: true });

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: allEntities,
          synchronize: true, // Set to false in production
        };
      },
    }),

    UserModule,
    VacancyModule,
    AssetModule,
    ApplicantModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtServiceImpl,
    },
  ],
})
export class AppModule {}
