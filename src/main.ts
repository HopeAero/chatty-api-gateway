import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DateTime } from "luxon";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { envs } from "./config";

async function bootstrap() {
  const appName = "Api Gateway";
  const timezone = DateTime.local().zoneName;
  const appVersion = "0.0.1";

  const logger = new Logger(appName);

  const app = await NestFactory.create(AppModule);
  await app.listen(envs.PORT);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );

  logger.log(`🚀  Server is running at ${await app.getUrl()}`);
  logger.log(`🚀  App Name: ${appName}`);
  logger.log(`🚀  Timezone:  ${timezone}`);
  logger.log(`🚀  Version:  ${appVersion}`);
}
bootstrap();
