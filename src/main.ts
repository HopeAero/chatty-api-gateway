import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import { envs } from './config';

async function bootstrap() {
  const appName = 'Auth-Microservice';
  const d = DateTime.local();
  const timezone = d.zoneName;
  const appVersion = '1.0.0';

  const logger = new Logger('Auth-Microservice');
  
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.PORT);
  
  logger.log(`🚀  Server is running at ${await app.getUrl()}`);
  logger.log(`🚀  App Name: ${appName}`);
  logger.log(`🚀  Timezone:  ${timezone}`);
  logger.log(`🚀  Version:  ${appVersion}`);
}
bootstrap();
