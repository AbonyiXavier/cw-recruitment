import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './domain/auth/auth.module';
import createConnectionOptions from '../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { AwsS3UploadModule } from './domain/aws-s3-upload/aws-s3-upload.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './domain/auth/guards/jwt-auth.guard';
import { ClientModule } from './domain/client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(createConnectionOptions),
    AuthModule,
    AwsS3UploadModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
