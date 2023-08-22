import jwtDecode, { JwtPayload } from "jwt-decode";
import Router from "next/router";
import { parseCookies } from "nookies";
export const redirectUser = (ctx: any, location: string) => {

    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location })
        ctx.res.end();
    }
    else {
        // window.location.href = location
        Router.push(location)
    }

}


export const getServerRedirect = ({ context, pageProps }: any) => {

    const { token } = parseCookies(context);


    if (!token) {
        // redirectUser(context, '/');
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
            props: pageProps,
        }
    };
    pageProps.user = jwtDecode<JwtPayload>(token);

    return {
        props: pageProps, // will be passed to the page component as props
    };
}
