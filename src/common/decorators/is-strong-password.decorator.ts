import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export function IsStrongPassword() {
  return applyDecorators(
    IsString(),
    MinLength(5, { message: 'password length MUST greater or equal 5' }),
    MaxLength(12, { message: 'password length MUST less than or equal 12' }),
    Matches(/(?=.*[a-z])/, { message: 'Must have lowercase' }),
    Matches(/(?=.*[A-Z])/, { message: 'Must have uppercase' }),
    Matches(/(?=.*\d)/, { message: 'Must have number' }),
    Matches(/(?=.*[!@#$%^&*])/, { message: 'Must have special digit' }),
  );
}
