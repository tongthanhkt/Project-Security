import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { RealIP } from 'nestjs-real-ip'

import { RestrictIpMiddleware } from '../restrict-ip/restrict-ip.middleware'
import { PartnerDto } from './dto/partner.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { LocalAuthGuard } from './local/local-auth.guard'
import { AuthService } from './auth.service'

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/access_token')
  async login(@Body() partner: PartnerDto) {
    return await this.authService.login(partner)
  }
  @Post('/register')
  async register(@Body() partner: PartnerDto) {
    return await this.authService.register(partner)
  }
  
}
