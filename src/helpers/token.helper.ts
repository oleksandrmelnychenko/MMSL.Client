import { CookieHelper } from './cookie.helper';

export class TokenHelper {
  private static readonly tokenAccessId: string = '.MMSL.Session';

  public static parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  public static SetToken(token: string): void {
    TokenHelper.SetAccessToken(token);
  }

  private static SetAccessToken(token: string): void {
    let expires = new Date();
    let accessToken = TokenHelper.parseJwt(token);
    expires.setTime(expires.getTime() + accessToken.exp);

    CookieHelper.setCookie(TokenHelper.tokenAccessId, token, expires);
  }

  public static isAuthenticated(): boolean {
    const token = CookieHelper.getCookie(TokenHelper.tokenAccessId);
    return !!token;
  }

  public static getAccessToken(): string {
    const token = CookieHelper.getCookie(TokenHelper.tokenAccessId);
    return token;
  }

  public static removeAccessToken(): void {
    CookieHelper.deleteCookie(TokenHelper.tokenAccessId);
  }
}
