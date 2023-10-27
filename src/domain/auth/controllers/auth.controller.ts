import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { SignUpInput, registerDto } from '../dto/input/signup.input';
import { Public } from '../../../common/decorators/public.decorator';
import { SignInInput } from '../dto/input/signin.input';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Client Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: SignUpInput,
    description: 'Sign up successfully!',
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @UseInterceptors(AnyFilesInterceptor())
  async registerClient(
    @Body() input: registerDto,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    const [result, error] = await this.authService.signUp(input, photos);

    if (error) {
      throw error;
    }

    return result;
  }

  @Public()
  @Post('/login')
  @ApiCreatedResponse({
    type: SignInInput,
    description: 'Logged in successfully!',
  })
  @ApiUnauthorizedResponse()
  async login(@Body() input: SignInInput) {
    const [result, error] = await this.authService.signIn(input);

    if (error) {
      throw error;
    }

    return result;
  }
}
