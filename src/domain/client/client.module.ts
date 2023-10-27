import { Module } from '@nestjs/common';
import { ClientController } from './controllers/client.controller';
import { Client } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFacingServices } from './services';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  controllers: [ClientController],
  providers: [...PublicFacingServices],
  exports: [...PublicFacingServices],
})
export class ClientModule {}
