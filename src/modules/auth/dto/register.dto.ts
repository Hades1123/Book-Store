import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsStrongPassword } from 'src/common/decorators/is-strong-password.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5, { message: 'Name is too short' })
  fullName: string;

  @IsString()
  phone: string;

  @IsStrongPassword()
  password: string;
}
