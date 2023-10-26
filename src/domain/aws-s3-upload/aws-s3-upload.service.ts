import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3UploadService {
  constructor(private configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow(
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
    },
  });

  async upload(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: file,
      }),
    );
  }
}
