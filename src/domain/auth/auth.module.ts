import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientModule } from '../client/client.module';
import { AwsS3UploadModule } from '../aws-s3-upload/aws-s3-upload.module';

@Module({
  imports: [ClientModule, AwsS3UploadModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
