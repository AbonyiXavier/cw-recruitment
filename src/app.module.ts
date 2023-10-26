import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import createConnectionOptions from '../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { AwsS3UploadModule } from './domain/aws-s3-upload/aws-s3-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(createConnectionOptions),
    UserModule,
    AuthModule,
    AwsS3UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
