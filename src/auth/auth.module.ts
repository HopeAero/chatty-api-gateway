import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { envs } from "src/config";
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
  ],
  controllers: [AuthRestController],
  providers: [Authenticator, LocalStrategy, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
