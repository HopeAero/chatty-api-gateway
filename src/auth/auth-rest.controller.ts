import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request as ExpressRequest } from "express";
import { UserActive } from "src/common/interfaces/userActive.interface";
import { Authenticator } from "./authenticator";
import { LoginCredentials } from "./dtos/login-credentials";
import { RegistrationCredentials } from "./dtos/registration-credentials";
import { googleAuthLogin } from "./google-auth";
import { localAuthLogin, localAuthRegister } from "./local-auth";
import { GoogleOauthGuard } from "./login-strategies/google/google-oauth.guard";
import { Public } from "./login-strategies/public.decorator";
import { User } from "./login-strategies/user.decorator";

@Controller("auth-rest")
export class AuthRestController {
  constructor(private readonly authService: Authenticator) {}

  @Public()
  @Post("register")
  async register(@Body() credentials: RegistrationCredentials) {
    await this.authService.register(
      credentials.username,
      localAuthRegister(credentials),
    );

    return {
      message: "User created successfully",
    };
  }

  @Public()
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() credentials: LoginCredentials) {
    const { jwt } = await this.authService.login(localAuthLogin(credentials));

    console.log("JWT:", jwt);

    return {
      jwt,
    };
  }

  @Public()
  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    console.log("Google Auth");
  }

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: ExpressRequest & { user: { username: string; email: string } },
  ) {
    console.log("User:", req.user);
    const { jwt } = await this.authService.login(googleAuthLogin(req.user));

    return {
      jwt,
    };
  }

  @Get("my-profile")
  async getMyProfile(@User() user: UserActive) {
    return await this.authService.myProfile(user.username);
  }

  @Get("users")
  async getUsers() {
    return await this.authService.getUsers();
  }
}
