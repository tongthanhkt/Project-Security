import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { PartnerApiModule } from './partner-api.module';

async function bootstrap() {
  const app = await NestFactory.create(PartnerApiModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<any>(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Partner API')
    .setDescription('Partner API description')
    .setVersion('1.0')
    .addTag('Partner API')
    .build();
  const globalPrefix = 'api';
  const versionPrefix = 'v1';
  const myApp = 'fulfillment';
  app.setGlobalPrefix(`${globalPrefix}/${versionPrefix}/${myApp}`);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PARTNER_API_PORT || 3000;
  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
  });
}
bootstrap();
