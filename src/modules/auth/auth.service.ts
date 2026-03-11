import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async register() {
    /*
        1. Check if the email is exist -> exist -> log error
        2. if this is new user -> register -> req: email, password, phone, fullName, ?
        3. Do we need otp, we can receive it in email ? -> use node mailer?
        4. If we type correct otp -> register succesfully
    */
  }
}
