import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpController } from './otp/otp.controller';

@Module({
  imports: [],
  controllers: [AppController, OtpController],
  providers: [AppService],
})
export class AppModule {}
