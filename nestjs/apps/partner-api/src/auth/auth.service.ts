import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { SignOptions } from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import { RESPONSE } from '../enum/respCode';
import { Partner } from '../partner/entity/partner.entity';
import { PartnerService } from '../partner/partner.service';
import { PartnerDto } from './dto/partner.dto';

@Injectable()
export class AuthService {
  constructor(
    private partnerService: PartnerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(partner: any) {
    const accessToken = await this.generateAccessToken({
      partner_id: partner.partner_id,
    });

    return {
      return_code: RESPONSE.SUCCESS_CODE,
      message: RESPONSE.SUCCESS_MESSAGE,
      access_token: accessToken,
    };
  }
  async generateAccessToken({ partner_id: partner_id }): Promise<string> {
    const opts: SignOptions = {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRESIN'),
    };

    return this.jwtService.signAsync(
      {
        partner_id: partner_id,
        sid: nanoid(), // token uniqueness
      },
      opts,
    );
  }

  async validatePartner(
    partner_id: string,
    partner_secret: string,
  ): Promise<any> {
    const partner = await this.partnerService.findOne(partner_id);
    if (
      partner &&
      (await bcrypt.compare(partner_secret, partner.partner_secret))
    ) {
      const { partner_secret, ...result } = partner;

      return result;
    }

    return null;
  }
  async register(partner: PartnerDto) {
    try {
      await this.partnerService.register(partner);

      return {
        message: RESPONSE.SUCCESS_MESSAGE,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
