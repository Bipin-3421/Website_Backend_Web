import { Module } from '@nestjs/common';
import configuration, { AppConfig } from 'config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { VacancyModule } from 'module/vacancies/vacancy.module';
import { AssetModule } from 'asset/asset.module';
import { ApplicantModule } from './module/applicants/applicant.module';
import { ConnectionModule } from 'module/connection/connection.module';
import { JwtAuthGuard } from 'common/guard/jwt.guard';
import { ContactModule } from 'module/contact/contact.module';
import { MemberModule } from 'module/member/member.module';
import { DepartmentModule } from 'module/department/department.module';
import { DesignationModule } from 'module/designation/designation.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    VacancyModule,
    ApplicantModule,
    AssetModule,
    ContactModule,
    MemberModule,
    DepartmentModule,
    DesignationModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const redisConfig = configService.get('redis', { infer: true });
        
return {
          store: redisStore,
          host: redisConfig.host,
          port: redisConfig.port,
        };
      },
    }),

    ConnectionModule.forRoot(),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const mailConfig = configService.get('email', { infer: true });
        
return {
          transport: {
            host: mailConfig.host,
            secure: true,
            auth: {
              user: mailConfig.user,
              pass: mailConfig.password,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
