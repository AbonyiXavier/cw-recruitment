import { Controller, Get, Request } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Client APIs')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('user/me')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({
    description: 'Client fetched successfully!',
  })
  async userMe(@Request() req) {
    const [result, error] = await this.clientService.clientMe(
      req.user.client.id,
    );

    if (error) {
      return error;
    }

    return result;
  }
}
