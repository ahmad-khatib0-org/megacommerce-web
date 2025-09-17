import 'client-only'
import { getCookie, setCookie } from 'cookies-next/client'

export class LoginHelpers {
  constructor() { }

  private static clientID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!;
  private static redirectURL = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL!;
  private static oauthURL = process.env.NEXT_PUBLIC_OAUTH_AUTH_URL!;

  static prepareLoginUrl(): URL {
    const state = crypto.randomUUID();

    // Set cookie using cookies-next - works on both client and server
    setCookie('oauth_state', state, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300, // 5 minutes
    });

    console.log(this.oauthURL);
    const url = new URL(this.oauthURL);
    url.searchParams.set("client_id", this.clientID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid offline");
    url.searchParams.set("redirect_uri", this.redirectURL);
    url.searchParams.set("state", state);

    return url;
  }

  /**
   * returns a URL if the user needs to be redirected to an appropriate login path
   */
  static checkLoginUrl(currentUrl: string): URL | undefined {
    try {
      const url = new URL(currentUrl);
      // this to prevent infinite redirection, because if login_challenge is persists
      // so that means the client exchanged a login_challenge with the OAuth provider
      if (url.searchParams.get("login_challenge")) return undefined

      // Check required search params
      const requiredParams = ['client_id', 'response_type', 'scope', 'redirect_uri', 'state'];

      for (const param of requiredParams) {
        const value = url.searchParams.get(param);
        if (!value || value.trim() === '') {
          return this.prepareLoginUrl();
        }
      }

      const state = url.searchParams.get('state');

      const stateCookie = getCookie('oauth_state') as string;

      if (!stateCookie || stateCookie !== state) {
        return this.prepareLoginUrl();
      }

      // All checks passed
      return undefined;

    } catch (error) {
      return this.prepareLoginUrl();
    }
  }

  static getLoginChallengeParam(location: string): string {
    try {
      const url = new URL(location);
      return url.searchParams.get('login_challenge') ?? "";
    } catch {
      return "";
    }
  }
}
