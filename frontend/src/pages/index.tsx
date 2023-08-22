
import React from "react";

// Admin
import DifferentCosts from "@/components/DashboardComponents/Admin/DifferentCosts";
import StatisticsCard from "@/components/DashboardComponents/Admin/StatisticsCard";
import TotalEarning from "@/components/DashboardComponents/Admin/TotalEarning";
import TotalSell from "@/components/DashboardComponents/Admin/TotalSell";
import WeeklyOverView from "@/components/DashboardComponents/Admin/WeeklyOverView";

// Farm
import TotalProduct from "@/components/DashboardComponents/Farm/TotalProduct";
import DiffFarmCosts from "@/components/DashboardComponents/Farm/DiffFarmCosts";
import StockStatus from "@/components/DashboardComponents/Farm/StockStatus";
import { MdArrowDropDown } from "react-icons/md";
import CardLayout from "@/UI/Card/CardLayout";
import LineGraph from "@/components/Graphs/LineChart";
// import { wrapper } from "@/store/store";
import { saveUser } from "@/store/Slices/userSlice";

import nookies, { parseCookies } from 'nookies';
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { InferGetServerSidePropsType } from "next";
import { UserType } from "@/types/user";



export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {


  const admin = props?.user ? props?.user.isAdmin : false

  const wrapperCss = `w-full grid gap-[2.9rem] my-[2.9rem] mx-[1rem]`
  return admin ?
    <div className={`${wrapperCss}  grid-col-1 md:grid-col-2 lg:grid-cols-3`}>
      {/* for admin user */}
      <>
        <TotalSell />
        <StatisticsCard />
        <WeeklyOverView />
        <TotalEarning />
        <DifferentCosts />
      </>
    </div> : <div className={`${wrapperCss} grid-cols-4 lg:grid-cols-7`}>
      {/* for farm user */}
      <>
        <TotalProduct />
        <DiffFarmCosts />
        <StockStatus />
        <div className="col-span-full flex flex-row-reverse items-center gap-20">

          <div className="btn-group">
            <button className={`btn btn-lg btn-outline btn-active`}>Medicine</button>
            <button className={`btn btn-lg btn-outline`}>Feed</button>
          </div>

          <div className="dropdown">
            <label tabIndex={0} className="btn btn-lg btn-outline m-1 hover:btn-outline hover:bg-transparent"> Monthly  <MdArrowDropDown className="text-primary" /></label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Item 1</a></li>
              <li><a>Item 2</a></li>
            </ul>
          </div>

        </div>


        <CardLayout className="col-span-full h-[64rem]">
          <h1 className="text-center text-[2rem] leading-10 font-medium my-4">Monthly trend for medicine</h1>
          <LineGraph />
        </CardLayout>
      </>
    </div>

}


type PageProps = {
  user?: UserType
}

export async function getServerSideProps(context: any) {

  const pageProps: PageProps = {}
  const { token } = parseCookies(context);


  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: pageProps,
    }
  };
  const user = jwtDecode<UserType>(token);
  delete user.exp
  delete user.iat

  pageProps.user = user
  return {
    props: pageProps, // will be passed to the page component as props
  };
}

// interface MyToken {
//   name: string;
//   isAdmin: boolean;
//   email?: string;
//   phone?: string;
//   exp: number;
//   // whatever else is in the JWT.
// }

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async (ctx) => {
//       // we can set the initial state from here
//       // we are setting to false but you can run your custom logic here
//       // if (ctx.req.user) {
//       //   await store.dispatch(saveUser(ctx.req.user));
//       // }
//       // console.log("State on server", store.getState());
//       // Create a cookies instance


//       // const token = ctx.req.cookies['token'];

//       // // Get a cookie
//       // let decodedToken
//       // if (token) {
//       //   decodedToken = jwtDecode<JwtPayload>(token);
//       // }


//       // console.log(decodedToken); // works!

//       return {
//         props: {
//           // authState: false,

//         },
//       };
//     }
// );