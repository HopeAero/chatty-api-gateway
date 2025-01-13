import { DrizzleClient } from "src/drizzle/client";
import { AuthMethodType } from "src/drizzle/schemas";
import { googleAuthUserExists } from "./google-auth";
import { localAuthUserExists } from "./local-auth";

export const userExists = async ({
  username, //?pass a query to get username
  db,
}: {
  username: string;
  db: DrizzleClient;
}): Promise<{ exists: boolean; authMethods: AuthMethodType[] }> => {
  const authMethods: AuthMethodType[] = [];

  const localAuthExists = await localAuthUserExists({ username, db });

  if (localAuthExists) {
    authMethods.push("local");
  }

  const googleAuthExists = await googleAuthUserExists({ username, db });

  if (googleAuthExists) {
    authMethods.push("google");
  }

  return {
    exists: localAuthExists || googleAuthExists,
    authMethods,
  };
};
