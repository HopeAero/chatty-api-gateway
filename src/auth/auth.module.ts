import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AuthRestController } from './auth-rest.controller';
import { Authenticator } from './authenticator';
import { JwtStrategy } from './login-strategies/jwt.strategy';
import { LocalStrategy } from './login-strategies/local.strategy';


@Module({
  imports: [DrizzleModule,
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
  providers: [Authenticator, LocalStrategy, JwtStrategy],
})
export class AuthModule {}