import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import React, { useEffect, useRef, useState } from 'react';

import { FaEye } from 'react-icons/fa';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import Modal from '@/UI/Modal/modal';
import { Form, Formik } from 'formik';
import { getFeedType, getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import { TextInput } from '@/UI/input/TextInput';
import Select from '@/UI/select/Select';
import Loader from '@/UI/Loader/Loader';
import { onBlurHandler } from '@/utils/UIHelper';
import { date, number, object, string } from 'yup';
import MyToast from '@/UI/MyToast';
import { editDateFormat, shortDate } from '@/utils/dateFormat';
import { jwtUser } from '@/types/auth';

type Props = {}
const limit = 9;

const FeedInventory = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [pageData, setPageData] = useState(props.allfeedTransaction || [])
  const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit })
  const [total, setTotal] = useState<number>(Number(props.total));
  const [count, setCount] = useState<number>(Number(props.count));

  const [viewFeedData, setViewFeedData] = useState(initialValues);
  const [showModal, setShowModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(initialValues);

  const currentUniqueId = useRef<number>(0);

  let clearTime: any

  const validationSchema = object({
    feed_name: string().required("Feed name is Required"),
    feed_type: string().required("feed type is Required"),
    cost: number().min(0, "cost should not be less than 0").positive().required("cost is Required"),
    quantity: number().min(0, "quantity should not be less than 0").positive().required("quantity is Required"),
    date: date().required("Please select a valid date"),
  });

  async function fetchFeedDetailsWithPagination(limit: number, page: number) {
    setError(null)
    try {
      const url = '/feed-inventory' + paginationUrl({ l: props.settings.default_pagination_limit || limit, p: page });
      const res = await axiosHandler.get(url)
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }

      setPageData(res.data.data)
      setTotal(res.data.total)
      setCount(res.data.count)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error?.message
      console.log(msg);
      setError(msg);
    }
  }


  const feedTypeValues = props.feedType.map(val => ({ value: val.type, title: val.type }));

  // 1-> 'in stock', 2-> Low Stock, 3-> Out of Stock
  function lowStockChecker(value: number) {
    if (value === 0) return 3
    else if (props.settings.low_feed_parameter >= value) return 2
    else if (props.settings.low_feed_parameter < value) return 1
    return
  }


  const lastpage = Math.floor(count / pagination.limit);


  const tableData = pageData.map((val) => {
    const stockStatus = lowStockChecker(+val.quantity)
    return <React.Fragment key={val.id}> <tr>
      <td>{val.id}</td>
      <td>{val.feed_name}</td>
      <td>{shortDate(val.date)}</td>
      <td>{val.feed_type}</td>
      <td>
        <div className={`badge ${stockStatus === 1 ? `badge-success` : stockStatus === 2 ? `bg-orange-500 border-orange-500` : `bg-red-700 border-red-700`} p-4 text-[#fff]`}>{stockStatus === 1 ? 'In Stock' : stockStatus === 2 ? 'Low Stock' : 'Out of Stock'} </div>
      </td> {/* In Stock, Low Stock, Out of Stock */}
      <td>{val.quantity}</td>
      <td className='flex gap-2 justify-center'>
        {/* view */}
        <label htmlFor={`view-feed-details-modal-${viewFeedData.id}`} className='btn-primary text-lg opacity-50 btn-circle flex justify-center items-center cursor-pointer'
          onClick={() => setViewFeedData(val)}
        >
          <FaEye className='text-lg ' />
        </label>

        <Button
          onClick={() => deleteFeedDataModel(val.id)}
          type='button' className='btn-primary text-lg opacity-50 btn-circle'
        >
          <label id={`model-${currentUniqueId.current}-label`} htmlFor={`model-${currentUniqueId.current}`} className='w-full h-full flex justify-center items-center  cursor-pointer'>
            <BsFillTrash3Fill className='text-lg' />
          </label>
        </Button>
        <Button type='button' className='btn-primary text-lg opacity-50 btn-circle'
          onClick={() => {
            setCurrentEdit(val)
          }}
        >
          <label id="label-edit-feed-modal" htmlFor="edit-feed-modal" className='w-full h-full flex justify-center items-center cursor-pointer'><FiEdit2 className='text-lg ' />
          </label>
        </Button>
      </td>
    </tr>
    </React.Fragment>
  });

  const addFeed = (<Modal id="add-feed-modal" className=' max-w-5xl'>
    <h3 className="text-4xl font-bold mb-5">Add Feed</h3>
    <Formik
      initialValues={{
        feed_name: "",
        feed_type: "",
        cost: "",
        quantity: "",
        date: ""
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        setError(null)
        setSuccess(null)
        setLoading(true)
        //@ts-ignore
        values.date = new Date(values.date)
        try {
          const response = await axiosHandler.post('/feed-inventory', values)
          if (response.data.status !== 'ok') throw new Error(response.data.message)
          const feed = response.data.data

          actions.resetForm()
          setSuccess("Feed assigned successfully !")

          document?.getElementById('label-add-feed-modal')?.click()

        } catch (error: any) {
          console.log(error.response?.data.message)
          setError(error.response?.data.message)
        } finally {
          setLoading(false)
          if (clearTime) clearTimeout(clearTime)
          clearTime = setTimeout(() => {
            setError(null)
            setSuccess(null)
          }, 10000)
        }
      }}

    >
      {/* @ts-ignore */}
      {(props: FormikProps<Values>) => (
        <Form className="form-control my-auto w-full h-full py-5 px-3">
          <TextInput
            placeholder="Name"
            type="text"
            name="feed_name"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <TextInput
            placeholder="Purchase date"
            type="date"
            name="date"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <TextInput
            placeholder="Cost"
            type="number"
            name="cost"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <TextInput
            placeholder="Quantity"
            type="number"
            name="quantity"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />

          <Select name='feed_type'
            className='my-1 text-[1.5rem] bg-[#F5F5F5]'
            title='Feed Type'
            options={feedTypeValues}
          />

          <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
        </Form>
      )}
    </Formik>

  </Modal>
  )


  const editFeed = (<Modal id="edit-feed-modal" className=' max-w-5xl'>
    <h3 className="text-4xl font-bold mb-5">Edit Feed</h3>
    <Formik
      initialValues={{
        id: currentEdit.id,
        feed_name: currentEdit.feed_name,
        feed_type: currentEdit.feed_type,
        cost: currentEdit.cost,
        quantity: currentEdit.quantity,
        date: editDateFormat(currentEdit.date)
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        setError(null)
        setSuccess(null)
        setLoading(true)
        //@ts-ignore
        values.date = new Date(values.date)
        try {
          const response = await axiosHandler.put('/feed-inventory', values)
          if (response.data.status !== 'ok') throw new Error(response.data.message)
          let feed = response.data.data[0]

          setPageData(val => val.map(data => (data.id == feed.id) ? feed : data));

          setCurrentEdit(feed)

          actions.resetForm()
          setSuccess("Feed Edited successfully !")

          document?.getElementById('label-edit-feed-modal')?.click()

        } catch (error: any) {
          const msg = error.response?.data?.message ? error.response.data.message : error.message;
          setError(msg)
        } finally {
          setLoading(false)
          if (clearTime) clearTimeout(clearTime)
          clearTime = setTimeout(() => {
            setError(null)
            setSuccess(null)
          }, 10000)
        }
      }}
    >
      {/* @ts-ignore */}
      {(props: FormikProps<Values>) => (
        <Form className="form-control my-auto w-full h-full py-5 px-3">
          <TextInput
            placeholder="Name"
            type="text"
            name="feed_name"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
            disabled={true}
          />
          <TextInput
            placeholder="Purchase date"
            type="date"
            name="date"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <TextInput
            placeholder="Cost"
            type="number"
            name="cost"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <TextInput
            placeholder="Quantity"
            type="number"
            name="quantity"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />

          <Select name='feed_type'
            className='my-1 text-[1.5rem] bg-[#F5F5F5]'
            title='Feed Type'
            options={feedTypeValues}
          />

          <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
        </Form>
      )}
    </Formik>

  </Modal>
  )

  const viewFeedDetails = <Modal id={`view-feed-details-modal-${viewFeedData.id}`
  } className=' max-w-[45rem] max-h-[50rem]' >
    <div className="w-full h-full overflow-y-auto flex justify-center">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th>1</th>
            <td>Feed Name</td>
            <td>{viewFeedData.feed_name}</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th>2</th>
            <td>Feed Type</td>
            <td>{viewFeedData.feed_type}</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th>3</th>
            <td>Feed Price</td>
            <td>{viewFeedData.cost}</td>
          </tr>
          {/* row 4 */}
          <tr>
            <th>4</th>
            <td>Stock Status</td>
            {/* <td>{viewFeedData.cost}</td> */}
            <td>
              <div className={`badge ${lowStockChecker(+viewFeedData.quantity) === 1 ? `badge-success` : lowStockChecker(+viewFeedData.quantity) === 2 ? `bg-orange-500 border-orange-500` : `bg-red-700 border-red-700`} p-4 text-[#fff]`}>{lowStockChecker(+viewFeedData.quantity) === 1 ? 'In Stock' : lowStockChecker(+viewFeedData.quantity) === 2 ? 'Low Stock' : 'Out of Stock'} </div>
            </td> {/* In Stock, Low Stock, Out of Stock */}
          </tr>
          {/* row 5 */}
          <tr>
            <th>5</th>
            <td>Feed Quantity</td>
            <td>{viewFeedData.quantity}</td>
          </tr>
          {/* row 6 */}
          <tr>
            <th>6</th>
            <td>Date</td>
            <td>{shortDate(viewFeedData.date)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Modal >


  function deleteFeedDataModel(uniqueId: number) {
    currentUniqueId.current = uniqueId

    setShowModal(true)
    setSuccess(null)
    setError(null)

  }

  async function fetchPageDetailsWithPagination(limit: number, page: number) {
    setError(null)
    try {
      // const url = `/assign-medicine?l=${limit}&p=${page}`;
      const url = `/feed-inventory${paginationUrl({ l: limit, p: page })}`;
      const res = await axiosHandler.get(url)
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }
      // pageProps.allAssignMedicine = res.data.data
      setPageData(res.data.data)
      setTotal(res.data.total)
      setCount(res.data.count)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error?.message

      setError(msg);
    }
  }



  async function deleteFeedTransaction(id: number) {
    try {
      const url = '/feed-inventory/' + id;
      const res = await axiosHandler.delete(url)
      if (res.data.status !== "ok") throw new Error(res.data.message)

      setSuccess('Deleted Successfully');
      // setPageData(val => val.filter(data => data.id !== id));
      await fetchPageDetailsWithPagination(pagination.limit, pagination.page)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error.message
      console.log(msg);
      setError(msg);
    } finally {
      setShowModal(false)
      if (clearTime) clearTimeout(clearTime)
      clearTime = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 15000)
    }
  }


  useEffect(() => {
    //if (pagination.page === props.page) return
    (async () => await fetchFeedDetailsWithPagination(pagination.limit, pagination.page))()
    setError(null)
    setSuccess(null)
  }, [pagination.limit, pagination.page, props.page])


  return (
    <>

      {error && <MyToast type="error" message={error} />}
      {success && <MyToast type="success" message={success} />}

      {viewFeedDetails}  {/* view feed details */}
      {showModal &&
        <Modal show={false} id={`model-${currentUniqueId.current}`}>
          <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
          <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>

          <div className='flex w-full justify-evenly'>
            <label htmlFor={`model-${currentUniqueId.current}`} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button>
            </label>

            <Button className='btn-error' type='button' onClick={() => deleteFeedTransaction(currentUniqueId.current)} >Delete</Button>
          </div>
        </Modal>
      }


      {addFeed}
      {editFeed}
      {/* <div className='w-full h-full mx-5 pr-5'> */}
      <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
        <h1 className='text-3xl font-semibold'>Stock Status</h1>
        <label id='label-add-feed-modal' htmlFor="add-feed-modal" className='btn btn-outline btn-primary text-xl'>
          Add a Feed
        </label>
      </div>

      {/* <div className='w-full'> */}
      <CardLayout className='w-full h-[70vh] overflow-auto '>
        <table className="table bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
          {/* head */}
          <thead className='h-15 capitalize sticky '>
            <tr >
              {/* total 12 columns */}
              <td>Order ID</td>
              <td>Feed Name</td>
              <td>Purchase date</td>
              <td>Type of feed</td>
              <td>Stock status</td>
              <td>In stock (pieces)</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {tableData}
          </tbody>
        </table>
        {pageData.length === 0 && <div className='w-full h-full flex justify-center items-center'> <h1 className='text-center font-bold text-2xl'>No Data Available</h1></div>}
      </CardLayout>
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

          <Button type="button" className="btn btn-primary btn-lg" onClick={() => fetchFeedDetailsWithPagination(pagination.limit, pagination.page)}>
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
  )
}

export default FeedInventory

type PageProps = {
  user?: jwtUser;
  feedType: any[];
  total: number;
  page: number;
  count: number;
  settings?: any;
  allfeedTransaction: any[];
}


export async function getServerSideProps(context: any) {

  const pageProps: PageProps = {
    feedType: [],
    total: 0,
    count: 0,
    page: context?.query.p ? context?.query.p : 0,
    allfeedTransaction: [],
  };

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
    pageProps.feedType = await getFeedType(context)
  } catch (error: any) {
    console.log(error.message);
  }

  try {
    const url = '/feed-inventory' + paginationUrl({ l: pageProps.settings.default_pagination_limit, p: 0 })
    const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
    if (res.data.status !== 'ok') {
      throw new Error(res.data.message)
    }
    pageProps.allfeedTransaction = res.data.data
    pageProps.count = res.data.count
    pageProps.total = res.data.total

  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
  }

  //TODO: get feed_type

  return {
    props: pageProps, // will be passed to the page component as props
  };
}

const initialValues = {
  id: 0,
  feed_name: "",
  feed_type: "",
  cost: "",
  quantity: "",
  date: new Date()
}