import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Authenticator } from "./authenticator";
import { LoginCredentials } from "./dtos/login-credentials";
import { RegistrationCredentials } from "./dtos/registration-credentials";
import { Public } from "./login-strategies/public.decorator";

@Public()
@Controller("auth-rest")
export class AuthRestController {
  constructor(private readonly authService: Authenticator) {}

  @Post("register")
  async register(@Body() credentials: RegistrationCredentials) {
    await this.authService.register(credentials.username, credentials.password);
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() credentials: LoginCredentials) {
    const { jwt } = await this.authService.login(
      credentials.username,
      credentials.password,
    );
    return {
      jwt,
    };
  }
}
