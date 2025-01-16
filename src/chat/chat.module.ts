import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CHAT_SERVICE, envs } from "src/config";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  imports: [
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
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
