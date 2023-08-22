import Router, { useRouter } from "next/router";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NProgress from "nprogress";
import { motion } from "framer-motion";
import { Provider } from "react-redux";
import store from '../../store/store';


type Props = {
  children: ReactNode;
  user?: any;
};

function Layout(props: Props): any {
  const router = useRouter();
  const href = router.pathname;
  const query = router.query;

 

  const[toggle,setToggle]=useState<boolean>(false);
  //   console.log(query);
  if (typeof window !== "undefined") {
    // NProgress.configure({ showSpinner: false });
    Router.events.on("routeChangeStart", () => {
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });

    Router.events.on("routeChangeError", () => {
      NProgress.done();
    });
  }

  // useEffect(()=>{
  //   if(screen?.width>=768 && toggle===false){
  //     setToggle(true)
  //   }
  // },[screen?.width, toggle])
  if (typeof window !== 'undefined') {
  useEffect(() => {
//  (() => {
      if (window.innerWidth > 768 ) setToggle(true);
    // })();


  }, [window.innerWidth]);
  }




  const style = {
    marginRight: 10,
    color: router.asPath === href ? "red" : "black",
  };

  //   const handleClick = (e) => {
  //     e.preventDefault();
  //     router.push(href);
  //   };

  // return (href !== "/login" ?
  return (!(/\/login|\/forgot-password\/*|\/reset-password\/*/).test(href) ?
    <Provider store={store}>
      <Navbar setToggle={setToggle} toggle={toggle}/>
      <div className="h-fit w-full flex flex-row gap-1">
        <Sidebar toggle={toggle} user={props.user} />
        <motion.div
          key={router.asPath}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }} className="w-full h-fit mx-5 pr-5 ">
          {props.children}
        </motion.div>
      </div>
    </Provider> : props.children
  );

}

export default Layout;
