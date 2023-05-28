import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { databaseConfig } from '../database/database.config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { Partner } from './partner/entity/partner.entity';
import { PartnerModule } from './partner/partner.module';
import { RestrictIpMiddleware } from './restrict-ip/restrict-ip.middleware';
import { PartnerApiController } from './partner-api.controller';
import { PartnerApiService } from './partner-api.service';
import { OtpModule } from './otp/otp.module';
import { OtpService } from './otp/otp.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_PARTNER_DATABASE_NAME,
      entities: [Partner],
      logging: 'all',
    }),
    AuthModule,
    PartnerModule,
    OtpModule,
  ],
  // Provide the Injectable Service to implement in file Controller Provider => Controler
  providers: [PartnerApiService, OtpService],
  controllers: [PartnerApiController],
})
export class PartnerApiModule {}
