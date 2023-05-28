import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partner } from './entity/partner.entity';
import { PartnerService } from './partner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
