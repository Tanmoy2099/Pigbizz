
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";

import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';

import Modal from '@/UI/Modal/modal';
import { TextInput } from '@/UI/input/TextInput';
import { useField, Form, FormikProps, Formik } from "formik";

import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import Select from '@/UI/select/Select';
// import { Assign_medicine, Batch, Medicine_Type } from '@prisma/client';
import { onBlurHandler } from '@/utils/UIHelper';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import MyToast from '@/UI/MyToast';
import Loader from '@/UI/Loader/Loader';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import { editDateFormat, editDateTimeFormat, shortDate } from '@/utils/dateFormat';

import { object, string, number, boolean, date } from 'yup';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import { getMedicineInventoryNames } from '@/utils/apiRequests';
import { jwtUser } from '@/types/auth';

interface Values {
  medicine_name: string,
  dose: number | string,
  batch_no: string,
  medicine_type: string,
  price: number | string,
  date: Date | string,
}

const limit = 9

type Props = {}

const AssignedMedicine = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [pageData, setPageData] = useState(props.allAssignMedicine || [])
  const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit })
  const [total, setTotal] = useState<number>(Number(props.total))
  const [count, setCount] = useState<number>(Number(props.count))
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('')
  const [currentEdit, setCurrentEdit] = useState({
    id: 0,
    medicine_name: "",
    dose: 0,
    batch_no: "",
    medicine_type: "",
    price: 0,
    date: new Date()
  })

  const currentUniqueId = useRef<number>(0);
  const router = useRouter();

  const validationSchema = object({
    medicine_name: string().required("Medicine name is Required"),
    dose: number().min(0, "dose should not be less than 0").positive().required("dose is Required"),
    batch_no: string().required("batch no is Required"),
    medicine_type: string().required("medicine type is Required"),
    price: number().min(0, "price should not be less than 0").positive().required("price is Required"),
    date: date().required("Please select a valid date"),
  });

  const medicineName = props.medicineName.map(val => ({ value: val.medicine_name, title: val.medicine_name }));

  useEffect(() => {
    // //if (pagination.page === props.page) return
    (async () => await fetchPageDetailsWithPagination(pagination.limit, pagination.page, filter))()

    setError(null)
    setSuccess(null)
  }, [pagination.limit, pagination.page, props.page, filter])



  async function fetchPageDetailsWithPagination(limit: number, page: number, filter: string) {
    setError(null)
    const filt = filter ? `filter=${filter}` : ""
    try {
      // const url = `/assign-medicine?l=${limit}&p=${page}`;
      const url = `/assign-medicine${paginationUrl({ l: limit, p: page })}&${filt}`;
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
      console.log(msg);
      setError(msg);
    }
  }




  async function deleteAssignedMedicine(id: number) {
    try {
      const url = '/assign-medicine/' + id;
      const res = await axiosHandler.delete(url)
      if (res.data.status !== "ok") throw new Error(res.data.message)

      setSuccess('Deleted Successfully');
      // setPageData(val => val.filter(data => data.id !== id));
      await fetchPageDetailsWithPagination(pagination.limit, pagination.page, filter)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error.message
      console.log(msg);
      setError(msg);
    } finally {
      setShowModal(false)
      setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 15000)
    }
  }

  function deleteAssignMedicineDataModel(uniqueId: number) {
    currentUniqueId.current = uniqueId

    setShowModal(true)
    setSuccess(null)
    setError(null)

  }

  const batchValues = props.batchList.map(val => ({ value: val.batch, title: val.batch }));
  const medicineTypeValues = props.medicineType.map(val => ({ value: val.type, title: val.type }));

  // const tableData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((val) => <React.Fragment key={val}> <tr>
  const tableData = pageData.map((val) => <React.Fragment key={val.id}> <tr>
    <td>{val.medicine_name}</td>
    <td>{val.batch_no}</td>
    <td>{val.dose}</td>
    <td>{val.dose * val.price}</td>
    <td>{shortDate(val.date)}</td>
    <td><div className={`badge ${val.status === "complete" ? `badge-success` : `bg-orange-500 border-orange-500`}  p-4 text-[#fff]`}>{val.status === "complete" ? 'Completed' : 'Pending'}
    </div></td>
    <td className='flex gap-2 justify-center'>

      <Button
        onClick={() => deleteAssignMedicineDataModel(val.id)}
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
        <label htmlFor="edit-assign-medicine-modal" className='w-full h-full flex justify-center items-center  cursor-pointer'><FiEdit2 className='text-lg ' /></label>
      </Button>
    </td>
  </tr>
  </React.Fragment>)




  const lastpage = Math.floor(count / pagination.limit)

  console.log(filter);


  return (
    <>

      {showModal &&
        <Modal show={false} id={`model-${currentUniqueId.current}`}>
          <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
          <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>

          <div className='flex w-full justify-evenly'>
            <label htmlFor={`model-${currentUniqueId.current}`} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button>
            </label>


            <Button className='btn-error' type='button' onClick={() => deleteAssignedMedicine(currentUniqueId.current)} >Delete</Button>
          </div>
        </Modal>
      }

      {error && <MyToast type="error" message={error} />}
      {success && <MyToast type="success" message={success} />}
      {/* <div className='w-[100%] h-full mx-5 '> */}

      <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
        <h1 className='text-3xl font-semibold'>Assigned medicine</h1>
        <div className='flex items-center gap-10'>
          <label htmlFor="assign-medicine-modal" className='btn btn-outline btn-primary text-xl'>Assign medicine</label>
          <select onChange={e => {
            //TODO: check if useEffect runs after changing only one state
            setFilter(e.target.value)
            setPagination({ page: 0, limit: props.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit })
          }} className="select select-primary text-lg px-2 pr-7 rounded w-[12rem]">

            {/* TODO: need to implement this  */}
            <option value='' selected>All</option>
            <option value='pending'>Pending</option>
            <option value='complete'>Complete</option>
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
              <th>Medicine</th>
              <th>Batch/tag</th>
              <th>Dose</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Status</th>
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

          <Button type="button" className="btn btn-primary btn-lg" onClick={() => fetchPageDetailsWithPagination(pagination.limit, pagination.page, filter)}>
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

      {/* model for add assigned medicine */}
      <Modal id="assign-medicine-modal" className='max-w-5xl' >
        <h3 className="text-4xl font-bold mb-5">Assign Medicine</h3>
        <Formik
          initialValues={{
            medicine_name: "",
            dose: "",
            batch_no: "",
            medicine_type: "",
            price: "",
            date: ""
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            // setTimeout(() => {
            // console.log(JSON.stringify(values, null, 2));
            // actions.setSubmitting(false);
            // }, 1000);
            setError(null)
            setSuccess(null)
            setLoading(true)
            //@ts-ignore
            values.date = new Date(values.date)
            try {
              const response = await axiosHandler.post('/assign-medicine', values)
              if (response.data.status !== 'ok') throw new Error(response.data.message)
              const medicine = response.data.data

              // if (medicine) {
              actions.resetForm()
              setSuccess("Medicine assigned successfully !")
              // }


            } catch (error: any) {
              console.log(error.response?.data.message)
              setError(error.response?.data.message)
            } finally {
              setLoading(false)
            }

          }}
        >
          {/* @ts-ignore */}
          {(props: FormikProps<Values>) => (
            <Form className="form-control my-auto w-full h-full py-5 px-3">
              <Select name='medicine_name'
                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                title='Select Medicine Name'
                options={medicineName}
              />

              <TextInput
                placeholder="Dose"
                type="number"
                name="dose"
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              />

              {/* <TextInput
                placeholder="Batch"
                type="text"
                name="batch"
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              /> */}
              <Select name='batch_no'
                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                title='Select batch no'
                options={batchValues}
              />
              <Select name='medicine_type'
                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                title='Medicine type'
                options={medicineTypeValues}
              />
              <TextInput
                placeholder="Price"
                type="number"
                name="price"
                // onFocus={e => (e.target.type = 'number')}
                // onBlur={onBlurHandler}
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              />


              <TextInput
                type="text"
                id="date"
                name="date"
                placeholder="Date"
                onFocus={e => (e.target.type = 'datetime-local')}
                onBlur={onBlurHandler}
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              />
              <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
            </Form>
          )}
        </Formik>

      </Modal>


      {/* model for edit medicine */}
      <Modal id="edit-assign-medicine-modal" className='max-w-5xl'>
        <h3 className="text-4xl font-bold mb-5">Edit Assign Medicine</h3>
        <Formik
          initialValues={{
            id: currentEdit.id,
            medicine_name: currentEdit.medicine_name,
            dose: currentEdit.dose,
            batch_no: currentEdit.batch_no,
            medicine_type: currentEdit.medicine_type,
            price: currentEdit.price,
            date: editDateTimeFormat(currentEdit.date)
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            // setTimeout(() => {
            // console.log(JSON.stringify(values, null, 2));
            // actions.setSubmitting(false);
            // }, 1000);
            setError(null)
            setSuccess(null)
            setLoading(true)
            //@ts-ignore
            values.date = new Date(values.date)
            try {
              const response = await axiosHandler.put('/assign-medicine', values)
              if (response.data.status !== 'ok') throw new Error(response.data.message)
              const medicine = response.data.data
              setPageData(val => val.map(data => {
                if (data.id !== medicine.id) return data
                return medicine
              }))
              // if (medicine) {
              actions.resetForm()
              setSuccess("Medicine assigned successfully !")
              // }


            } catch (error: any) {
              console.log(error.response?.data.message)
              setError(error.response?.data.message)
            } finally {
              setLoading(false)
            }

          }}
        >
          {/* @ts-ignore */}
          {(props: FormikProps<Values>) => (
            <Form className="form-control my-auto w-full h-full py-5 px-3">
              <Select name='medicine_name'
                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                title='Select Medicine Name'
                options={medicineName}
              />

              <TextInput
                placeholder="Dose"
                type="number"
                name="dose"
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              />

              {/* <TextInput
                placeholder="Batch"
                type="text"
                name="batch"
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              /> */}
              <Select name='batch_no'
                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                title='Select batch no'
                options={batchValues}
              />
              <Select name='medicine_type'
                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                title='Medicine type'
                options={medicineTypeValues}
              />
              <TextInput
                placeholder="Price"
                type="number"
                name="price"
                // onFocus={e => (e.target.type = 'number')}
                // onBlur={onBlurHandler}
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              />

              <TextInput
                type="text"
                id="date"
                name="date"
                placeholder="Date"
                onFocus={e => (e.target.type = 'datetime-local')}
                onBlur={onBlurHandler}
                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
              />
              <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
    // </div>
  )
}

export default AssignedMedicine;

type PageProps = {
  user?: jwtUser;
  batchList: any[];
  medicineType: any[];
  allAssignMedicine: any[];
  total: number;
  page: number;
  count: number;
  medicineName: { id: number, medicine_name: string, medicine_type: string }[];
  settings?: any;
}

export async function getServerSideProps(context: any) {

  const pageProps: PageProps = {
    batchList: [],
    medicineType: [],
    allAssignMedicine: [],
    total: 0,
    count: 0,
    medicineName: [{ id: 0, medicine_name: '', medicine_type: '' }],
    page: context?.query.p ? context?.query.p : 0
  };
  // console.log(context?.query.p, 'src/pages/assign-medicine 304');

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

  // try {
  //   const allBatch = await getAllBatchDB()
  //   console.log(allBatch);

  //   pageProps.batchList = JSON.parse(JSON.stringify(allBatch))
  // } catch (error: any) {
  //   console.log(error.message);
  // }

  try {
    //fetch using axios
    const url = '/pig/all-batch';
    const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })

    if (res.data.status !== 'ok') throw new Error(res.data.message)
    pageProps.batchList = res.data.data
  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);

  }


  try {
    pageProps.settings = await getSettings(context)
  } catch (error: any) {
    console.log(error.message);
  }


  try {
    //fetch using axios
    const url = '/assign-medicine/type';
    const cookies = axiosHeaderAuth(context)
    console.log(cookies, "cookies vaccination 565");

    const res = await systemAxios.get(url, { headers: cookies })

    if (res.data.status !== 'ok') throw new Error(res.data.message)
    pageProps.medicineType = res.data.data
  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);

  }
  const take = pageProps?.settings?.default_pagination_limit ? pageProps.settings.default_pagination_limit : limit

  try {
    const url = `/assign-medicine${paginationUrl({ l: take, p: pageProps.page })}`;
    const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })
    if (res.data.status !== 'ok') {
      throw new Error(res.data.message)
    }
    pageProps.allAssignMedicine = res.data.data
    pageProps.total = res.data.total
    pageProps.count = res.data.count

  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
  }

  try {
    pageProps.medicineName = await getMedicineInventoryNames(context)
  } catch (error: any) {
    console.log(error.message);
  }



  return {
    props: pageProps, // will be passed to the page component as props
  };
}






{/* <div className='w-full grid grid-cols-2 gap-2'>
              <TextInput
                  placeholder="Date"
                  type="text"
                  name="date"
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={onBlurHandler}
                  className="my-1 text-[1.5rem] bg-[#F5F5F5]"
                />

                <TextInput
                  placeholder="Time"
                  type="text"
                  name="time"
                  onFocus={e => (e.target.type = 'time')}
                  onBlur={onBlurHandler}
                  className="my-1 text-[1.5rem] bg-[#F5F5F5]"
                />
              </div> */}