import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import { ServerConfig } from 'config/config-types';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const serverConfig = config.get('server') as ServerConfig;
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useBodyParser('text');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin ${serverConfig.origin}`);
  }

  const port = process.env.PORT || serverConfig.port;

  await app.listen(port, () => {
    const server = app.getHttpServer();
    const address = server.address();
    const host = address ? (typeof address === 'string' ? address : address.address) : 'localhost';
    const actualPort = typeof address === 'object' && address ? address.port : port;
    logger.log(`Application is listening on http://${host}:${actualPort}`);
  });
}

bootstrap();
