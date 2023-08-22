import React, { useEffect, useRef, useState } from 'react';

import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { InferGetServerSidePropsType } from "next";
import Modal from '@/UI/Modal/modal';
import { Form, Formik } from 'formik';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import { TextInput } from '@/UI/input/TextInput';
import Select from '@/UI/select/Select';
import Loader from '@/UI/Loader/Loader';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import { date, number, object, string } from 'yup';
import { onBlurHandler } from '@/utils/UIHelper';
import MyToast from '@/UI/MyToast';
import { editDateFormat, editDateTimeFormat, shortDate } from '@/utils/dateFormat';
import { jwtUser } from '@/types/auth';

type Props = {}
const limit = 9;

const Infrastructural = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [pageData, setPageData] = useState(props.pageData || [])
  const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit });
  const [total, setTotal] = useState<number>(Number(props.total));
  const [count, setCount] = useState<number>(Number(props.count));
  const [monthVal, setMonthVal] = useState<number>(-1);
  const [currentEdit, setCurrentEdit] = useState({
    id: -1,
    name: "",
    cost_type: "",
    cost: "",
    date: new Date()
  })


  const [showModal, setShowModal] = useState(false);
  // const [viewFeedData, setViewFeedData] = useState(initialValues);
  // const [currentEdit, setCurrentEdit] = useState(initialValues);

  let timeOutCleaningUpdateRequest: any;
  const currentUniqueId = useRef<number>(0);

  let clearTime: any

  const costTypeValues = props.costType.map(val => ({ value: val.type, title: val.type }));

  const validationSchema = object({
    expense_name: string().required("Expense name is Required"),
    cost_type: string().required("Cost type is Required"),
    cost: number().min(0, "cost should not be less than 0").positive().required("cost is Required"),
    date: date().required("Please select a valid date"),
  });

  useEffect(() => {
    setPagination(val => ({ ...val, page: 0 }))
  }, [monthVal])


  useEffect(() => {
    if (monthVal === -1) return
    (async () => await fetchPageDetailsWithPagination(pagination.limit, pagination.page, monthVal))()
    setError(null)
    setSuccess(null)
  }, [pagination.limit, pagination.page, monthVal, props.page])



  const editModelRequest = <Modal id="edit-infra-modal" className='max-w-5xl' >
    <h3 className="text-4xl font-bold mb-5">Edit Expense</h3>
    <Formik
      initialValues={{
        id: currentEdit.id,
        expense_name: currentEdit.name,
        cost_type: currentEdit.cost_type,
        cost: currentEdit.cost,
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
          const response = await axiosHandler.put('/expense', values)
          if (response.data.status !== 'ok') throw new Error(response.data.message)
          const expense = response.data.data;
          setPageData(val => val.map(d => d.id === expense.id ? expense : d))

          actions.resetForm()
          setSuccess("Expense edited successfully !")

          document?.getElementById('label-edit-infra-modal')?.click()

        } catch (error: any) {
          console.log(error.response?.data.message)
          setError(error.response?.data.message)
        } finally {
          setLoading(false)
          if (clearTime) {
            clearTimeout(clearTime)
            setError(null)
            setSuccess(null)
          }
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
            name="expense_name"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />

          <TextInput
            placeholder="Cost"
            type="number"
            name="cost"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <Select name='cost_type'
            className='my-1 text-[1.5rem] bg-[#F5F5F5]'
            title='Cost Type'
            options={costTypeValues}
          />
          <TextInput
            placeholder="Purchase date"
            type="text"
            name="date"
            onFocus={e => (e.target.type = 'date')}
            onBlur={onBlurHandler}
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />

          <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
        </Form>
      )
      }
    </Formik>
  </Modal>


  async function fetchPageDetailsWithPagination(limit: number, page: number, month: number) {
    setError(null)


    try {
      const url = '/expense' + paginationUrl({ l: limit, p: page }) + `&month=${month}`;
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
      setShowModal(false)
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

  const lastpage = Math.floor(count / pagination.limit);

  const tableData = pageData.map((val) => <React.Fragment key={val.id}> <tr>
    <td>{shortDate(val.date)}</td>
    <td>{val.name}</td>
    <td>{val.cost}</td>
    <td>{val.cost_type}</td> {/* crew, infra, purchase of new boar, saw */}
    <td className='flex gap-2 justify-center'>

      <Button
        onClick={() => deleteExpenseModel(val.id)}
        type='button' className='btn-primary text-lg opacity-50 btn-circle'
      >
        <label id={`model-${currentUniqueId.current}-label`} htmlFor={`model-${currentUniqueId.current}`} className='w-full h-full flex justify-center items-center  cursor-pointer'>
          <BsFillTrash3Fill className='text-lg' />
        </label>
      </Button>
      <Button type='button' className='btn-primary text-lg opacity-50 btn-circle'
        onClick={() => {
          setCurrentEdit(val)
        }}>
        <label id="label-edit-infra-modal" htmlFor="edit-infra-modal" className='w-full h-full flex justify-center items-center  cursor-pointer'><FiEdit2 className='text-lg ' />
        </label>
      </Button>
    </td>
  </tr>
  </React.Fragment>)


  useEffect(() => {
    //if (pagination.page === props.page) return
    (async () => await fetchExpenseWithPagination(pagination.limit, pagination.page))()
    setError(null)
    setSuccess(null)
  }, [pagination.limit, pagination.page, props.page])

  async function fetchExpenseWithPagination(limit: number, page: number) {
    setError(null)
    try {
      const url = `/expense${paginationUrl({ l: limit, p: page })}`;
      const res = await axiosHandler.get(url)
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }
      setPageData(res.data.data)
      setTotal(res.data.total)
      setCount(res.data.count)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error?.message;
      setError(msg);
    }
  }



  async function deleteExpense(id: number) {
    try {
      const url = '/expense/' + id;
      const res = await axiosHandler.delete(url)
      if (res.data.status !== "ok") throw new Error(res.data.message)

      setSuccess('Deleted Successfully');
      // setPageData(val => val.filter(data => data.id !== id));
      await fetchExpenseWithPagination(pagination.limit, pagination.page)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error.message

      setError(msg);
    } finally {
      setShowModal(false)
      if (clearTime) clearTimeout(clearTime)
      clearTime = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 10000)
    }
  }

  function deleteExpenseModel(uniqueId: number) {
    currentUniqueId.current = uniqueId

    setShowModal(true)
    setSuccess(null)
    setError(null)
  }



  const addExpense = (<Modal id="edit-expense-modal" className=' max-w-5xl'>
    <h3 className="text-4xl font-bold mb-5">Add Expense</h3>
    <Formik
      initialValues={{
        expense_name: "",
        cost_type: "",
        cost: "",
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
          const response = await axiosHandler.post('/expense', values)
          if (response.data.status !== 'ok') throw new Error(response.data.message)
          const expense = response.data.data;
          setPageData(val => [expense, ...val])

          actions.resetForm()
          setSuccess("Expense added successfully !")

          document?.getElementById('label-edit-expense-modal')?.click()

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
            name="expense_name"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />

          <TextInput
            placeholder="Cost"
            type="number"
            name="cost"
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />
          <Select name='cost_type'
            className='my-1 text-[1.5rem] bg-[#F5F5F5]'
            title='Cost Type'
            options={costTypeValues}
          />
          <TextInput
            placeholder="Purchase date"
            type="text"
            name="date"
            onFocus={e => (e.target.type = 'date')}
            onBlur={onBlurHandler}
            className="my-1 text-[1.5rem] bg-[#F5F5F5]"
          />

          <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
        </Form>
      )
      }
    </Formik>
  </Modal>
  )

  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  console.log(typeof monthVal);


  return (
    <>
      {error && <MyToast type="error" message={error} />}
      {success && <MyToast type="success" message={success} />}

      {editModelRequest}

      {showModal &&
        <Modal show={false} id={`model-${currentUniqueId.current}`}>
          <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
          <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>

          <div className='flex w-full justify-evenly'>
            <label htmlFor={`model-${currentUniqueId.current}`} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button>
            </label>

            <Button className='btn-error' type='button' onClick={() => deleteExpense(currentUniqueId.current)} >Delete</Button>
          </div>
        </Modal>
      }

      {addExpense}
      {/* <div className='w-[100%] h-full mx-5 '> */}
      <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
        <h1 className='text-3xl font-semibold'></h1>
        <div className='flex items-center gap-10'>
          <label id='label-edit-expense-modal' htmlFor="edit-expense-modal" className='btn btn-outline btn-primary text-xl'>
            ADD EXPENSES
          </label>
          <select
            value={monthVal === -1 ? 0 : monthVal}
            onChange={(e: any) => setMonthVal(+e.target.value)}
            className="select select-primary text-lg px-3 rounded">
            {/* <option disabled selected>Month: Jan</option>
            <option>Month: Feb</option>
            <option>Month: Mar</option> */}
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* <div className='w-full'> */}
      <CardLayout className='w-full h-[70vh] overflow-auto '>
        <table className="table bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
          {/* head */}
          <thead className='h-15 capitalize sticky '>
            <tr >
              {/* total 7 columns */}
              <th>Date</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Cost Type</th>
              <th>Action</th>
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

          <Button type="button" className="btn btn-primary btn-lg" onClick={() => fetchPageDetailsWithPagination(pagination.limit, pagination.page, monthVal)}>
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

export default Infrastructural;

type PageProps = {
  user?: jwtUser,
  costType: any[],
  pageData: any[],
  count: number,
  total: number,
  page: number,
  settings?: any,
}

export async function getServerSideProps(context: any) {

  const pageProps: PageProps = { settings: [], costType: [], pageData: [], count: 0, total: 0, page: 0 }
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
    const url = '/expense/type';
    const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
    if (res.data.status !== 'ok') throw new Error(res.data.message)

    pageProps.costType = res.data.data
  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
  }

  try {
    const url = '/expense' + paginationUrl({ l: pageProps.settings?.default_pagination_limit || limit, p: 0 })
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