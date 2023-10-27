import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '../../../../common/constant';

export class SignUpInput {
  @ApiProperty({ required: true })
  @IsString()
  @Length(2, 25, { message: 'first name must be between 2 and 25 characters!' })
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(2, 25, { message: 'last name must be between 2 and 25 characters!' })
  lastName: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsAlphanumeric()
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters!' })
  @Matches(/.*\d.*/, { message: 'Password must contain at least one number!' })
  password: string;

  @ApiProperty({ required: true })
  @ApiProperty({ required: false, enum: ['Admin', 'Client'] })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}

export class registerDto extends SignUpInput {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  photos: Array<Express.Multer.File>;
}
