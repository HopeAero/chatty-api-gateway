import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/drizzle/schema';
import { Authenticator } from '../authenticator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: Authenticator,
  ) {
    super({
      usernameField: 'username',
    });
  }
  async validate(username: string, password: string): Promise<User> {
    try {
      const { user } = await this.authService.login(username, password);
      return user;
    } catch (InvalidCredentialsError) {
      throw new UnauthorizedException();
    }
  }
}