import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpInput } from '../dto/input/signup.input';
import { AuthResponseOutput } from '../dto/output/auth.response.output';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { CreateTokenResponse } from '../types/auth.type';
import { getConnection } from 'typeorm';
import { User } from '../../client/entities/user.entity';
import { Photo } from '../../client/entities/photo.entity';
import { Client } from '../../client/entities/client.entity';
import { AwsS3UploadService } from '../../aws-s3-upload/services/aws-s3-upload.service';
import { validatePhotoUploads } from '../../aws-s3-upload/utils/validate.photo.upload';
import { SignInInput } from '../dto/input/signin.input';
import { createFullName } from '../utils';
import { UserService } from '../../client/services/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AwsS3UploadService)
    private readonly awsS3UploadService: AwsS3UploadService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async signUp(
    input: SignUpInput,
    photos: Array<Express.Multer.File>,
  ): Promise<[AuthResponseOutput, HttpException]> {
    try {
      const { firstName, lastName, email, password, role } = input;

      await this.checkDuplicateEmail(email);

      // Validate file types
      validatePhotoUploads(photos);

      let result: AuthResponseOutput;

      await getConnection().transaction(async (manager) => {
        const hashedPassword = await argon.hash(password);
        const payload = {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
        };

        // save to user table
        const savedUser = await manager.save(User, payload);
        const { accessToken } = await this.createToken(
          savedUser?.id,
          savedUser?.email,
        );

        const photoUrls: string[] = [];
        await Promise.all(
          photos.map(async (file: Express.Multer.File) => {
            const uploadedFile = await this.awsS3UploadService.uploadPublicFile(
              file.originalname,
              file.buffer,
            );

            // save to photo table
            const photo = await manager.save(Photo, {
              name: uploadedFile.Key,
              url: uploadedFile.Location,
              user: savedUser,
            });
            photoUrls.push(photo.url);
          }),
        );

        // save to client table
        const client = await manager.save(Client, {
          photos: photoUrls,
          user: savedUser,
        });

        const fullName = createFullName(firstName, lastName);

        result = {
          accessToken,
          client: {
            id: client.id,
            fullName,
            firstName: client.user.firstName,
            lastName: client.user.lastName,
            email: client.user.email,
            role: client.user.role,
            avatar: client.avatar,
            photos: client.photos,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
          },
        };
      });

      return [result, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async signIn(
    input: SignInInput,
  ): Promise<[AuthResponseOutput, HttpException]> {
    const { email, password } = input;

    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const isPasswordMatch = await argon.verify(user?.password, password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const { accessToken } = await this.createToken(user?.id, user?.email);

      const fullName = createFullName(user?.firstName, user?.lastName);

      const result = {
        accessToken,
        client: {
          id: user.id,
          fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.client.avatar,
          photos: user.client.photos,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      return [result, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async createToken(
    clientId: string,
    email: string,
  ): Promise<CreateTokenResponse> {
    const accessToken = this.jwtService.sign(
      {
        clientId,
        email,
      },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return { accessToken };
  }

  async checkDuplicateEmail(email: string): Promise<void> {
    const existingClient = await this.userService.findUserByEmail(email);

    if (existingClient) {
      throw new ConflictException('Email already in use.');
    }
  }
}
