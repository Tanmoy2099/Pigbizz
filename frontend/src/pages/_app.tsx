import React from "react";
// import { wrapper } from "../store/store";


import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
// import type { AppProps } from "next/app";
import { AnimatePresence } from 'framer-motion';

import 'react-toastify/dist/ReactToastify.css';
import { redirectUser } from "@/utils/redirectUser";
import { parseCookies } from "nookies";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { jwtUser } from "@/types/auth";

// type App {
//   Component: NextPage;
//   pageProps: PageProps
// }
function App({ Component, pageProps }: any) {

  return (
    <AnimatePresence>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </AnimatePresence>
  );
}

type PageProps = {
  user?: jwtUser
}

// App.getInitialProps = async ({ ctx }: any) => {
//   // const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
//   let pageProps: PageProps = {}
//   const notLoggedInPages = ['/login']
//   // const token = context.req.cookies['token'];
//   // const token = ctx.req.cookies['token'];
//   const protectedPath = !notLoggedInPages.includes(ctx.pathname) // /login !== / true
//   const { token } = parseCookies(ctx)
//   // Get a cookie
//   console.log(token);
//   console.log(ctx.pathname);
//   console.log(protectedPath);



//   let decodedToken: JwtPayload

//   if (!token) {
//     protectedPath && redirectUser(ctx, '/login')
//   } else {
//     !protectedPath && redirectUser(ctx, '/')
//     decodedToken = jwtDecode<JwtPayload>(token);
//     pageProps.user = decodedToken



//   }
//   return { pageProps };
// };

App.getInitialProps = async ({ component, ctx }: any) => {

  const { token } = parseCookies(ctx);

  let pageProps: PageProps = {};

  if (token) pageProps.user = jwtDecode<jwtUser>(token);


  // pageProps.user = jwtDecode<JwtPayload>(token);


  return { pageProps }
}








// export default wrapper.withRedux(App);
export default App;