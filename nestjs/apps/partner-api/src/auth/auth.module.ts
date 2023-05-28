import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partner } from '../partner/entity/partner.entity';
import { PartnerModule } from '../partner/partner.module';
import { PartnerService } from '../partner/partner.service';
import { RestrictIpMiddleware } from '../restrict-ip/restrict-ip.middleware';
import { JwtStrategy } from './jwt/jwt.trategy';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner]),
    PassportModule,
    JwtModule.register({
      secret: 'secret',
    }),
    PartnerModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PartnerService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
