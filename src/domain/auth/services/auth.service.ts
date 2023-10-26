import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {
  create(createAuthDto: any) {
    return 'This action adds a new auth';
  }
}
