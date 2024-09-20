import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'config/configuration';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Black tech web API')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .addTag('Black tech PVT LTD')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get<ConfigService<AppConfig, true>>(ConfigService);

  const port = configService.get('port', { infer: true });

  await app.listen(port, () => {
    console.log(`server is working in port:${port}`);
  });
}
void bootstrap();
