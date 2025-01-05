import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DateTime } from "luxon";
import { AppModule } from "./app.module";
import { envs } from "./config";

async function bootstrap() {
  const appName = "Api Gateway";
  const timezone = DateTime.local().zoneName;
  const appVersion = "0.0.1";

  const logger = new Logger(appName);

  const app = await NestFactory.create(AppModule);
  await app.listen(envs.PORT);

  logger.log(`🚀  Server is running at ${await app.getUrl()}`);
  logger.log(`🚀  App Name: ${appName}`);
  logger.log(`🚀  Timezone:  ${timezone}`);
  logger.log(`🚀  Version:  ${appVersion}`);
}
bootstrap();
