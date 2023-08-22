import React from 'react';
import { InferGetServerSidePropsType } from "next";
import jwtDecode from 'jwt-decode';
import { parseCookies } from 'nookies';
import { systemAxios } from '@/utils/axiosHandler';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import Loader from '@/UI/Loader/Loader';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import MyToast from '@/UI/MyToast';
import Modal from '@/UI/Modal/modal';
import AdminUserForJob from '@/components/jobCard/AdminUserForJob';
import { jwtUser } from '@/types/auth';
import FarmUserForJob from '@/components/jobCard/FarmUserForJob';

// interface Values {
//   assignee_id: any;
//   assigned_id: any;
//   task: string;
//   remark: string;
// }

// type Props = {}
const limit = 5
const JobCard = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => props?.user?.isAdmin ? <AdminUserForJob {...props} /> : <FarmUserForJob  {...props} />


export default JobCard;

type PageProps = {
  user?: jwtUser,
  farmUser: any[],
  pageData: any[],
  count: number,
  total: number,
  page: number,
  settings?: any,
}

export async function getServerSideProps(context: any) {

  const pageProps: PageProps = {
    farmUser: [],
    settings: [],
    pageData: [],
    count: 0, total: 0, page: 0
  }
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
  pageProps.user = jwtDecode<jwtUser>(token);


  try {
    pageProps.settings = await getSettings(context)
  } catch (error: any) {
    console.log(error.message);
  }


  if (pageProps.user.isAdmin) {
    try {
      const url = '/auth/farm'
      const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }
      pageProps.farmUser = res.data.data

    } catch (error: any) {
      console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
    }
    try {
      const url = '/tasks/assign-task' + paginationUrl({ l: pageProps.settings?.small_list_pagination_limit || limit, p: 0 })
      const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }

      pageProps.pageData = res.data.data
      pageProps.count = res.data.count
      pageProps.total = res.data.total
      pageProps.page = res.data.page

    } catch (error: any) {
      console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
    }
  } else {

    try {
      const url = '/tasks/user-task/' + pageProps.user.id + paginationUrl({ l: pageProps.settings?.default_pagination_limit || limit, p: 0 })
      const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
      if (res.data.status !== 'ok') { throw new Error(res.data.message) }

      pageProps.pageData = res.data.data
      pageProps.count = res.data.count
      pageProps.total = res.data.total
      pageProps.page = res.data.page

    } catch (error: any) {
      console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
    }
  }

  return {
    props: pageProps, // will be passed to the page component as props
  };
}