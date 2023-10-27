import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ConfigService } from '@nestjs/config';

import * as packageJson from 'package.json';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const { version } = packageJson;

    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT');

    const getVersion = Math.floor(parseInt(version));

    app.setGlobalPrefix(`api/v${getVersion}`);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    setupSwagger(app);

    await app.listen(PORT, () =>
      Logger.log(`Service is running at: http://localhost:${PORT}`),
    );
  } catch (error) {
    Logger.error('Error starting server', error);
  }
}
bootstrap();
