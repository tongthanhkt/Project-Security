import { Allow, IsArray, IsObject, IsOptional, IsString } from 'class-validator'

export class PartnerDto {
  @IsString()
  partner_id: string

  @IsString()
  partner_secret: string

  @IsOptional()
  @IsArray()
  ip_address: string[]
}
