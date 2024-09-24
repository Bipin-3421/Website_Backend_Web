import { Module } from '@nestjs/common';
import configuration from 'config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'module/auth/user.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ConnectionModule.forRoot(),
    VacancyModule,
    ApplicantModule,
    UserModule,
    AssetModule,
    ContactModule,
    MemberModule,
    DepartmentModule,
    DesignationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
