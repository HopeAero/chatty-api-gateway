import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { DrizzleClient } from "src/drizzle/client";
import { DRIZZLE_TOKEN } from "src/drizzle/drizzle.module";
import { User, users } from "src/drizzle/schemas";

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

  async register(username: string, password: string): Promise<void> {
    const [userExists] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (userExists) {
      throw new Error("The username is already being used");
    }

    await this.db.insert(users).values({
      username,
      password: await bcryptjs.hash(password, 10),
    });
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ user: User; jwt: string }> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const jwtPayload: JwtPayload = {
      username,
    };
    return {
      user,
      jwt: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
