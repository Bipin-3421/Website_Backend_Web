import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'config/configuration';
import * as basicAuth from 'express-basic-auth';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<AppConfig, true>>(ConfigService);

  app.setGlobalPrefix('api/v1');

  const docsPassword = configService.get('docs', { infer: true });
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      users: { admin: docsPassword },
      challenge: true,
    }),
  );

  const corsConfig = configService.get('cors', { infer: true });

  app.use(
    cors({
      origin: corsConfig.allowedDomains,
      credentials: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Black tech web API')
    .setDescription('Backend API description')
    .setVersion('1.0')
    .addTag('Black tech PVT LTD')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.get('port', { infer: true });

  await app.listen(port, () => {
    console.log(`server is working in port:${port}`);
  });
}
void bootstrap();
