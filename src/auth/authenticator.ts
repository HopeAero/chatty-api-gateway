import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DrizzleClient } from "src/drizzle/client";
import { DRIZZLE_TOKEN } from "src/drizzle/drizzle.module";
import { User } from "src/drizzle/schemas";

export type JwtPayload = {
  username: string;
};

export class AuthenticatorError extends Error {}
export class InvalidCredentialsError extends AuthenticatorError {}

@Injectable()
export class Authenticator {
  constructor(
    @Inject(DRIZZLE_TOKEN) private db: DrizzleClient,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerFunction: (db: DrizzleClient) => Promise<void>,
  ): Promise<void> {
    await registerFunction(this.db);
  }

  async login(
    loginFunction: (
      db: DrizzleClient,
      jwt: JwtService,
    ) => Promise<{ user: User; jwt: string }>,
  ): Promise<{ user: User; jwt: string }> {
    return await loginFunction(this.db, this.jwtService);
  }
}
