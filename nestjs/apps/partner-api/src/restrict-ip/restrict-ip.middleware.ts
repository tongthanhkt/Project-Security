import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as ipaddr from 'ipaddr.js'
import * as requestIp from 'request-ip'

import { RESPONSE } from '../enum/respCode'
import { PartnerService } from '../partner/partner.service'

@Injectable()
export class RestrictIpMiddleware implements NestMiddleware {
  constructor(private partnerService: PartnerService) {}
  private readonly allowIps: string[] = ['127.0.0.1']
  
  async use(req: Request, res: Response, next: NextFunction) {
    const { partner_id } = req.body
    const ip = requestIp.getClientIp(req)
    const ipv4 = ip.includes(':') ? ip.split(':').pop() : ip
    console.log(ipv4)
    const partner = await this.partnerService.findOne(partner_id)

    if (!partner)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED)
    const ipAddresses = partner.ip_address
    if (ipAddresses.includes(ipv4)) next()
    else
      throw new HttpException(
        {
          return_code: RESPONSE.INVALID_IP_CODE,
          message: RESPONSE.INVALID_IP_MESSAGE,
        },
        HttpStatus.FORBIDDEN,
      )
  }
}
