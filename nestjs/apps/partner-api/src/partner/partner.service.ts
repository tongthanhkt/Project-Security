import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { PartnerDto } from '../auth/dto/partner.dto'
import { Partner } from './entity/partner.entity'

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}
  async findOne(partner_id: string): Promise<Partner | undefined> {
    if (!partner_id) return undefined

    return await this.partnerRepository.findOne({
      where: { partner_id: partner_id },
    })
  }
  async register(partner: PartnerDto) {
    console.log(partner)
    const existPartner = await this.partnerRepository.findOne({
      where: {
        partner_id: partner.partner_id,
      },
    })
    if (existPartner) {
      console.log('is exist')
      throw new HttpException('Partner id is exist !!', HttpStatus.BAD_REQUEST)
    }
    const salt = await bcrypt.genSalt()
    const newPartner = new Partner()
    newPartner.partner_id = partner.partner_id
    newPartner.partner_secret = await bcrypt.hash(partner.partner_secret, salt)
    newPartner.ip_address = partner.ip_address
    newPartner.created_at = new Date().getTime().toString()
    try {
      await this.partnerRepository.save(newPartner)
      const { partner_secret, ...result } = newPartner

      return result
    } catch (error) {}
  }
}
