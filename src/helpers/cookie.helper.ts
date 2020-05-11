export class CookieHelper {
  public static setCookie(name: string, value: string | null, exdays: any) {
    const expires = `expires=${new Date(exdays * 1000).toString()}`;
    (document as Document).cookie =
      name + '=' + value + ';' + expires + ';path=/';
  }

  public static deleteCookie(name: string) {
    CookieHelper.setCookie(name, '', {
      'max-age': -1
    });
  }

  public static getCookie(name: string) {
    const cookieName = name + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
      let cookie = cookieArr[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }

    return '';
  }
}
