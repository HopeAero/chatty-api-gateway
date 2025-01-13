import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import { DrizzleClient } from "src/drizzle/client";
import { authMethods, googleAuth, User, users } from "src/drizzle/schemas";
import { JwtPayload } from "./authenticator";
import { userExists } from "./user-exists";

export const googleAuthUserExists = async ({
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
    .innerJoin(googleAuth, eq(googleAuth.id, authMethods.id))
    .where(eq(users.username, username));

  return result.length > 0;
};

export const googleAuthRegister =
  ({ username, email }: { username: string; email: string }) =>
  async (db: DrizzleClient) => {
    const user = await userExists({ username, db });

    if (user.exists && user.authMethods.includes("google")) {
      throw new Error("The username is already being used");
    }

    const emailUsed = await db
      .select()
      .from(googleAuth)
      .where(eq(googleAuth.email, email));

    if (emailUsed.length > 0) {
      throw new Error("The email is already being used");
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
          type: "google",
        })
        .returning();

      if (authMethodsRows.length === 0) {
        tx.rollback();
      }

      const [authMethod] = authMethodsRows;

      await tx.insert(googleAuth).values({
        id: authMethod.id,
        email,
      });
    });
  };

export const googleAuthLogin =
  ({ username, email }: { username: string; email: string }) =>
  async (
    db: DrizzleClient,
    jwt: JwtService,
  ): Promise<{ user: User; jwt: string }> => {
    const user = await userExists({
      username,
      db,
    });

    if (!user.exists || !user.authMethods.includes("google")) {
      await googleAuthRegister({ username, email })(db);
    }

    const jwtPayload: JwtPayload = {
      username,
    };

    return {
      user: {
        username,
      },
      jwt: await jwt.signAsync(jwtPayload),
    };
  };
