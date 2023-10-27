import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Repository } from 'typeorm';
import { SafeClientResponseOutput } from '../dto/output/client.response.output';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async clientMe(
    clientId: string,
  ): Promise<[SafeClientResponseOutput, HttpException]> {
    try {
      const client = await this.findClientById(clientId);

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      const result: SafeClientResponseOutput = {
        id: client.id,
        firstName: client.user.firstName,
        lastName: client.user.lastName,
        email: client.user.email,
        avatar: client.avatar,
        photos: client.photos,
        role: client.user.role,
        active: client.user.active,
      };

      return [result, null];
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return [null, error];
    }
  }

  async findClientByEmail(email: string): Promise<Client | undefined> {
    try {
      return await this.clientRepository.findOne({
        where: {
          email,
        },
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async findClientById(clientId: string): Promise<Client | undefined> {
    try {
      return await this.clientRepository.findOne({
        where: {
          id: clientId,
        },
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
}
