import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { envs } from "src/config";

const SCOPE = ["email", "profile"];

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: envs.GOOGLE_CLIENT_ID,
      clientSecret: envs.GOOGLE_CLIENT_SECRET,
      callbackURL: envs.GOOGLE_CALLBACK_URL,
      scope: SCOPE,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log(profile);
    const { id, name, emails } = profile;

    const user = {
      provider: "google",
      providerId: id,
      email: emails[0].value,
      username: `${name.givenName} ${name.familyName}`,
    };

    done(null, user);
  }
}
