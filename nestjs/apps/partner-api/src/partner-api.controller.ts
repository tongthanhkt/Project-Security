import {
  Controller,
  Get,
  Injectable,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PartnerService } from './partner/partner.service';
import { PartnerApiService } from './partner-api.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';

@Injectable()
@Controller('/')
export class PartnerApiController {
  constructor(private partnerApiService: PartnerApiService) {}

  @Post('/get-otp')
  async getOtp(@Req() req: Request) {
    return await this.partnerApiService.getOtp(req);
  }
  @Post('/verify-otp')
  async verifyOtp(@Req() req: Request) {
    return await this.partnerApiService.verifyOtp(req);
  }
}
