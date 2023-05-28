import { Injectable, Req } from '@nestjs/common';
import { OtpService } from './otp/otp.service';
import { Request } from 'express';
@Injectable()
export class PartnerApiService {
  private otp;
  constructor(private otpService: OtpService) {}
  async onModuleInit() {
    this.otp = await this.otpService.generateOTP();
    setInterval(async () => {
      this.otp = await this.otpService.generateOTP();
      console.log('Interval', this.otp);
    }, 60000);
  }
  async getOtp(@Req() req: Request): Promise<any> {
    const subject = 'Your OTP';
    const bodyText = ` 
    Xin chào bạn,
     
    Gần đây, bạn đã sử dụng xác thực 2 yếu tố. Để hoàn thành quy trình xác thực, vui lòng xác nhận tài khoản của bạn: ${this.otp}`;
    try {
      await this.otpService.sendEmail(req.body.email, subject, bodyText);
      await this.otpService.sendToPhoneNumber(this.otp);
      return {
        status: 1,
        message: 'success',
      };
    } catch (error) {
      return {
        status: 0,
        message: 'fail',
      };
    }
  }
  verifyOtp(@Req() req: Request): any {
    console.log('This otp', this.otp);
    console.log('Req body', req.body.otp);
    return {
      status: req.body.otp === this.otp ? 1 : 0,
      message: req.body.otp === this.otp ? 'success' : 'fail',
    };
  }
}
