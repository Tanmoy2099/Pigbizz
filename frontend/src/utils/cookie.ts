import cookie from "js-cookie";
export function setCookie(token: any) {
    cookie.set("token", token, { sameSite: 'none', secure: true })
}