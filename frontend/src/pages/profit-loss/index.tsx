import React, { useEffect, useState } from 'react';

import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import { FiSearch } from 'react-icons/fi';
import { parseCookies } from 'nookies';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { InferGetServerSidePropsType } from "next";
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import { shortDate } from '@/utils/dateFormat';
import { jwtUser } from '@/types/auth';


const limit = 9;
type Props = {}
const ProfitLoss = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [pageData, setPageData] = useState(props.pageData || []);
  const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: +props.page, limit: props.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit });
  const [total, setTotal] = useState<number>(+props.total);
  const [count, setCount] = useState<number>(+props.count);
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState('');

  let timeOutCleaningUpdateRequest: any;
  const lastpage = Math.floor(count / pagination.limit);
  // const tableData = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => <React.Fragment key={val}> <tr>
  const tableData = pageData.map((val) => <React.Fragment key={val}> <tr>
    <td>{val.unique_id}</td>
    <td>{shortDate(val?.sold_date)}</td>
    <td>{val.pig_details?.weight}</td>
    <td className='text-primary'>₹{val?.price}</td>
  </tr>
  </React.Fragment>)

  useEffect(() => {
    //if (pagination.page === props.page) return
    (async () => await fetchPageDetailsWithPagination(pagination.limit, pagination.page))()
    setError(null)
    setSuccess(null)
  }, [pagination.limit, pagination.page, props.page])


  async function fetchPageDetailsWithPagination(limit: number, page: number) {
    setError(null)

    try {
      const url = '/sold-pigs' + paginationUrl({ l: limit, p: page });
      const res = await axiosHandler.get(url)
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }
      setPageData(res.data.data)
      setTotal(res.data.total)
      setCount(res.data.count)

    } catch (error: any) {
      const msg = error.response?.data?.message ? error?.response?.data?.message : error?.message
      console.log(msg);
      setError(msg);
    } finally {
      if (timeOutCleaningUpdateRequest) {
        clearTimeout(timeOutCleaningUpdateRequest)
        setSuccess(null)
        setError(null)
      }
      timeOutCleaningUpdateRequest = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 10000);
    }
  }



  // Custom debounce function to delay API calls
  const debounce = (func: any, delay: any = 300) => {
    let timer: any;
    return function (...args: any[]) {
      clearTimeout(timer);
      //@ts-ignore
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };


  const debouncedSearch = debounce((searchTerm: string) => {
    // Make an API call to the backend to get search results
    if (searchTerm.length === 8) {
      axiosHandler.get(`/sold-pigs/${searchTerm}`)
        .then((response) => {
          setPageData(response.data.data);
          if (response.data.data.length > 0) setSuccess('Successfully found the data')
        })
        .catch((error) => {
          const msg = error.response?.data?.message ? error?.response?.data?.message : error?.message
          console.log(msg);
          setError(msg);
        }).finally(() => {
          if (timeOutCleaningUpdateRequest) {
            clearTimeout(timeOutCleaningUpdateRequest)
            setSuccess(null)
            setError(null)
          }
          timeOutCleaningUpdateRequest = setTimeout(() => {
            setSuccess(null)
            setError(null)
          }, 10000);
        });
    }
  }, 100);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      //@ts-ignore
      clearTimeout(debouncedSearch);
    };
  }, [searchTerm]);

  function handleChange(e: any) {
    const value = e.target.value
    if (searchTerm.length === 0 && value.length === 1) setPagination(val => ({ ...val, page: 0 }));
    setSearchTerm(value);
    if (value.length === 0) fetchPageDetailsWithPagination(pagination.limit, pagination.page);
    // debouncedSearch(searchTerm);
  }


  return (
    <>
      {/* <div className='w-[100%] h-full mx-5 '> */}
      <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
        <h1 className='text-3xl font-semibold'>List of sold pig</h1>
        <div className='flex items-center gap-10'>
          {/* TODO: may this select need to added later */}
          {/* <select className="select select-primary text-lg px-3 rounded pr-10">
            <option disabled selected>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select> */}

          <div className='relative text-[1.5rem]'>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <FiSearch />
            </span>
            {/* TODO: add search api and useEffect to show the details */}
            <input
              type="text"
              placeholder="Search a ID"
              className="input w-full max-w-xs pl-10 rounded-lg text-lg"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* <div className='w-full'> */}
      <CardLayout className='w-full h-[70vh] overflow-auto '>
        <table className="table bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
          {/* head */}
          <thead className='h-15 capitalize sticky '>
            <tr >
              {/* total 7 columns */}
              <th>Unique ID</th>
              <th>Date of sold</th>
              <th>Weight of pig
                (kg)</th>
              <th>Sold price
                (/kg)</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {tableData}
          </tbody>
        </table>
        {pageData.length === 0 && <div className='w-full h-full flex justify-center items-center'> <h1 className='text-center font-bold text-2xl'>No Data Available</h1></div>}
      </CardLayout>
      {/* <div className="w-full flex justify-center my-5">
        <div className="btn-group m-auto">
          <Button type="button" className="btn_page_lg btn-primary">«</Button>
          <Button type="button" className="btn_page_lg btn-primary">1</Button>
          <Button type="button" className="btn_page_lg btn-primary">2</Button>
          <Button type="button" className="btn_page_lg btn-primary">3</Button>
          <Button type="button" className="btn_page_lg btn-primary">»</Button>
        </div>
      </div> */}
      <div className="w-full flex justify-center my-5">
        <div className="btn-group m-auto">
          {pagination.page !== 0 &&
            <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: 0 }))}>«</Button>}

          {pagination.page > 1 && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: val.page - 2 }))}>
            {pagination.page - 1}
          </Button>}

          {pagination.page > 2 && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: val.page - 1 }))}>
            {pagination.page}
          </Button>}

          <Button type="button" className="btn btn-primary btn-lg" onClick={() => fetchPageDetailsWithPagination(pagination.limit, pagination.page)}>
            {pagination.page + 1}
          </Button>

          {(pagination.page < lastpage - 2) && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: lastpage - 2 }))}>{lastpage - 1}</Button>}

          {(pagination.page < lastpage - 1) && <Button type="button" className="btn_page_lg btn-primary"
            onClick={() => setPagination(val => ({ ...val, page: lastpage }))}
          >{lastpage - 1}</Button>}

          {(pagination.page < lastpage) && <Button type="button"
            onClick={() => setPagination(val => ({ ...val, page: lastpage }))}
            className="btn_page_lg btn-primary">»</Button>}
        </div>
      </div>
      {/* </div> */}
    </>
    // </div>
  )
}

export default ProfitLoss;

type PageProps = {
  user?: jwtUser,
  pageData: any[],
  count: number,
  total: number,
  page: number,
  settings?: any,
}

export async function getServerSideProps(context: any) {

  const pageProps: PageProps = { pageData: [], count: 0, total: 0, page: 0 }
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

  try {
    const url = '/sold-pigs' + paginationUrl({ l: pageProps.settings?.default_pagination_limit || limit, p: 0 })
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


  return {
    props: pageProps, // will be passed to the page component as props
  };
}