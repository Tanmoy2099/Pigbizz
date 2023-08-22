import cookie from "js-cookie";

const token = cookie.get('token');

export function axiosHeaderAuth(ctx: any) {
    // console.log(ctx.req.headers['cookie']);
    const tokenctx = ctx.req.headers?.cookie;
    return { Cookie: tokenctx ?? token, tokenctx }
}
