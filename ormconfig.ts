import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseCredentials = JSON.parse(process.env.DATABASE_CREDENTIALS);
const currentEnv = process.env.APP_ENV;

const createConnectionOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: databaseCredentials.host,
  port: databaseCredentials.port,
  username: databaseCredentials.username,
  password: databaseCredentials.password,
  database: databaseCredentials.database,
  logging: ['development'].includes(currentEnv) ? true : ['error'],
  synchronize: true,
  migrationsRun: true,
  entities: ['dist/src/**/*.entity.{js,ts}'],
  migrations: ['dist/src/database/migrations/*.{js,ts}'],
  cli: {
    migrationsDir: ['production', 'staging'].includes(currentEnv)
      ? 'dist/src/database/migrations'
      : 'src/database/migrations',
  },
};

export default createConnectionOptions;
