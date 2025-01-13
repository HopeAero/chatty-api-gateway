import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserActive } from "src/common/interfaces/userActive.interface";
import { Authenticator } from "./authenticator";
import { LoginCredentials } from "./dtos/login-credentials";
import { RegistrationCredentials } from "./dtos/registration-credentials";
import { Public } from "./login-strategies/public.decorator";
import { User } from "./login-strategies/user.decorator";

@Controller("auth-rest")
export class AuthRestController {
  constructor(private readonly authService: Authenticator) {}

  @Public()
  @Post("register")
  async register(@Body() credentials: RegistrationCredentials) {
    await this.authService.register(credentials.username, credentials.password);
    return {
      message: "User created successfully",
    };
  }

  @Public()
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

  @Get("my-profile")
  async getMyProfile(@User() user: UserActive) {
    return await this.authService.myProfile(user.username);
  }

  @Get("users")
  async getUsers() {
    return await this.authService.getUsers();
  }
}
