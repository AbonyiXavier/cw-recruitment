import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsAlphanumeric, Length } from 'class-validator';

export class SignInInput {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsAlphanumeric()
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters!' })
  password: string;
}
