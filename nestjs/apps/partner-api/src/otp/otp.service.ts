import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as speakeasy from 'speakeasy';
import axios from 'axios';
@Injectable()
export class OtpService {
  private transporter;
  public otp = '';
  constructor() {
    dotenv.config();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }
  async generateOTP(): Promise<string> {
    return Math.floor(Math.random() * 100000).toString();
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text: body,
    });
  }
  async sendToPhoneNumber(otp: string): Promise<void> {
    const params = {
      from: 'Vonage APIs',
      to: '84921426686',
      text: otp,
      api_key: process.env.NEXMO_API_KEY,
      api_secret: process.env.NEXMO_API_SECRET,
    };
    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data,
      url: 'https://rest.nexmo.com/sms/json',
    };
    const response = await axios(options); // wrap in async function
    console.log(response.data);
  }
}
