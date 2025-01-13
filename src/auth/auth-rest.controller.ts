import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request as ExpressRequest } from "express";
import { Authenticator } from "./authenticator";
import { LoginCredentials } from "./dtos/login-credentials";
import { RegistrationCredentials } from "./dtos/registration-credentials";
import { googleAuthLogin } from "./google-auth";
import { localAuthLogin, localAuthRegister } from "./local-auth";
import { GoogleOauthGuard } from "./login-strategies/google/google-oauth.guard";
import { Public } from "./login-strategies/public.decorator";

@Public()
@Controller("auth-rest")
export class AuthRestController {
  constructor(private readonly authService: Authenticator) {}

  @Post("register")
  async register(@Body() credentials: RegistrationCredentials) {
    await this.authService.register(localAuthRegister(credentials));
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() credentials: LoginCredentials) {
    const { jwt } = await this.authService.login(localAuthLogin(credentials));
    return {
      jwt,
    };
  }

  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: ExpressRequest & { user: { username: string; email: string } },
  ) {
    const { jwt } = await this.authService.login(googleAuthLogin(req.user));
    return {
      jwt,
    };
  }
}
