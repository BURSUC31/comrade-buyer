import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { DbConfig } from 'config/config-types';

const dbConfig: DbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: Number(process.env.DB_PORT) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: Boolean(process.env.TYPEORM_SYNC) || dbConfig.synchronize,
};
