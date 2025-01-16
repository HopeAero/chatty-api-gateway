import { HttpException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { eq } from "drizzle-orm";
import { catchError, lastValueFrom } from "rxjs";
import { CHAT_SERVICE } from "src/config";
import { DrizzleClient } from "src/drizzle/client";
import { DRIZZLE_TOKEN } from "src/drizzle/drizzle.module";
import { User, users } from "src/drizzle/schemas";
import { extractErrorDetails } from "src/utils/extractErrorDetails";

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

  async register(
    username: string,
    registerFunction: (db: DrizzleClient) => Promise<void>,
  ): Promise<void> {
    await registerFunction(this.db);

    const payload = {
      username,
    };

    const response = await lastValueFrom(
      this.client.send("create_user", payload).pipe(
        catchError((error) => {
          const { status, message } = extractErrorDetails(error);
          throw new HttpException(message, status);
        }),
      ),
    );
  }

  async login(
    loginFunction: (
      db: DrizzleClient,
      jwt: JwtService,
    ) => Promise<{ user: User; jwt: string }>,
  ): Promise<{ user: User; jwt: string }> {
    return await loginFunction(this.db, this.jwtService);
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

  async getUsers() {
    const usersList = await this.db
      .select({ username: users.username })
      .from(users)
      .execute();

    console.log(usersList);

    return usersList;
  }
}
