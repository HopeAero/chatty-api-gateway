import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Authenticator } from "src/auth/authenticator";
import { localAuthLogin } from "src/auth/local-auth";
import { User } from "src/drizzle/schemas";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: Authenticator) {
    super({
      usernameField: "username",
    });
  }
  async validate(username: string, password: string): Promise<User> {
    try {
      const { user } = await this.authService.login(
        localAuthLogin({ username, password }),
      );
      return user;
    } catch (InvalidCredentialsError) {
      throw new UnauthorizedException();
    }
  }
}
