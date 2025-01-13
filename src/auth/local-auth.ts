import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { DrizzleClient } from "src/drizzle/client";
import { authMethods, localAuth, User, users } from "src/drizzle/schemas";
import { JwtPayload } from "./authenticator";
import { userExists } from "./user-exists";

export const localAuthUserExists = async ({
  username, //?pass a query to get username
  db,
}: {
  username: string;
  db: DrizzleClient;
}): Promise<boolean> => {
  const result = await db
    .select()
    .from(users)
    .innerJoin(authMethods, eq(authMethods.userUsername, users.username))
    .innerJoin(localAuth, eq(localAuth.id, authMethods.id))
    .where(eq(users.username, username));

  return result.length > 0;
};

export const localAuthRegister =
  ({ username, password }: { username: string; password: string }) =>
  async (db: DrizzleClient) => {
    const user = await userExists({ username, db });

    if (user.exists && user.authMethods.includes("local")) {
      throw new Error("The username is already being used");
    }

    await db.transaction(async (tx) => {
      if (!user.exists) {
        await tx.insert(users).values({
          username,
        });
      }

      const authMethodsRows = await tx
        .insert(authMethods)
        .values({
          userUsername: username,
          type: "local",
        })
        .returning();

      if (authMethodsRows.length === 0) {
        tx.rollback();
      }

      const [authMethod] = authMethodsRows;

      await tx.insert(localAuth).values({
        id: authMethod.id,
        password: await bcryptjs.hash(password, 10),
      });
    });
  };

export const localAuthLogin =
  ({ username, password }: { username: string; password: string }) =>
  async (
    db: DrizzleClient,
    jwt: JwtService,
  ): Promise<{ user: User; jwt: string }> => {
    const user = await userExists({ username, db });

    if (!user.exists || !user.authMethods.includes("local")) {
      await localAuthRegister({ username, password })(db);
    }

    const [userInDb] = await db
      .select()
      .from(users)
      .innerJoin(authMethods, eq(authMethods.userUsername, users.username))
      .innerJoin(localAuth, eq(localAuth.id, authMethods.id))
      .where(eq(users.username, username));

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      userInDb.local_auth.password,
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const jwtPayload: JwtPayload = {
      username,
    };

    return {
      user: {
        username: userInDb.users.username,
      },
      jwt: await jwt.signAsync(jwtPayload),
    };
  };
