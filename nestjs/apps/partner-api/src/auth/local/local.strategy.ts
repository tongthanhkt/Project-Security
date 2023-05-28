import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { HttpResponse } from 'aws-sdk';
import { Strategy } from 'passport-local';

import { RESPONSE } from '../../enum/respCode';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'partner_id',
      passwordField: 'partner_secret',
    });
  }

  async validate(partner_id: string, partner_secret: string): Promise<any> {
    const partner = await this.authService.validatePartner(
      partner_id,
      partner_secret,
    );
    if (!partner) {
      throw new HttpException(
        {
          return_code: RESPONSE.INVALID_CREDENTIAL_CODE,
          message: RESPONSE.INVALID_CREDENTIAL_MESSAGE,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return partner;
  }
}
