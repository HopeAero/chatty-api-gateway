import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JwtGuard } from "./auth/login-strategies/jwt/jwt.guard";
import { JwtStrategy } from "./auth/login-strategies/jwt/jwt.strategy";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, DrizzleModule, ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
