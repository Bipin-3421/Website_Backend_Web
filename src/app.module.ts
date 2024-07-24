import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration, { DBConfiguration } from 'config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthGuardModule } from 'common/guard/guard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<DBConfiguration, true>) => {
        const dbConfig = configService.get('database', { infer: true });
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Set to false in production
        };
      },
    }),
    UserModule,
    AuthGuardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
