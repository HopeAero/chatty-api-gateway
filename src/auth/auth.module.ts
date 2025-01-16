import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CHAT_SERVICE, envs } from "src/config";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { AuthRestController } from "./auth-rest.controller";
import { Authenticator } from "./authenticator";
import { GoogleStrategy } from "./login-strategies/google/google.strategy";
import { JwtStrategy } from "./login-strategies/jwt/jwt.strategy";
import { LocalStrategy } from "./login-strategies/local/local.strategy";

@Module({
  imports: [
    DrizzleModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: envs.JWT_SECRET,
        signOptions: {
          expiresIn: envs.JWT_EXPIRES_IN,
        },
      }),
    }),
    ClientsModule.register([
      {
        name: CHAT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${envs.RABBITMQ_DEFAULT_USER}:${envs.RABBITMQ_DEFAULT_PASS}@${envs.RABBITMQ_HOST}:${envs.RABBITMQ_PORT}`,
          ],
          queue: "chat_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthRestController],
  providers: [Authenticator, LocalStrategy, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
