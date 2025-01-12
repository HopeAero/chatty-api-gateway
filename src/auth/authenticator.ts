import { HttpException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import * as bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { catchError, lastValueFrom } from "rxjs";
import { CHAT_SERVICE } from "src/config";
import { DrizzleClient } from "src/drizzle/client";
import { DRIZZLE_TOKEN } from "src/drizzle/drizzle.module";
import { User, users } from "src/drizzle/schemas";
import { extractErrorDetails } from "../utils/extractErrorDetails";

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
    @Inject(CHAT_SERVICE) private client: ClientProxy,
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

    const payload = {
      username,
    };

    const response = await lastValueFrom(
      this.client.send("create_user", payload).pipe(
        catchError((error) => {
          const { status, message } = extractErrorDetails(error);
          console.error("Error:", error, status, message);
          throw new HttpException(message, status);
        }),
      ),
    );

    return response;
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

  async myProfile(username: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new Error("User not found");
    }

    return {
      username: user.username,
    };
  }
}
