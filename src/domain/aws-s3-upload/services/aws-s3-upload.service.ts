import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3UploadService {
  private readonly logger = new Logger(AwsS3UploadService.name);
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  s3 = new S3({
    accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow('AWS_S3_SECRET_ACCESS_KEY'),
  });

  async uploadPublicFile(fileName: string, file: Buffer) {
    try {
      const uploadedResult = await this.s3
        .upload({
          Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
          Key: `${uuidv4()}-${fileName}`,
          Body: file,
          ACL: 'public-read',
        })
        .promise();

      return uploadedResult;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }
}
