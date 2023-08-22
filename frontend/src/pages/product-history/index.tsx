import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import React, { useEffect, useRef, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { InferGetServerSidePropsType } from "next";
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';

// import { PigData } from '@/types/pigData';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
// import { getAllPigs } from '@/utils/prismaCRUD';
// import { Batch, Pig_details } from '@prisma/client';
import Modal from '@/UI/Modal/modal';
import MyToast from '@/UI/MyToast';
// import { getAllBatchDB } from '@/utils/prismaCRUD/pigDetailsDB';
import { axiosHeaderAuth } from '../../utils/axiosHeaderAuth';
import EditPigForm from '@/components/EditPig/EditPigForm';
import { updatePig } from '@/utils/apiRequests';
import { editDateFormat, editDateTimeFormat, shortDate } from '@/utils/dateFormat';
import { jwtUser } from '@/types/auth';
// type Props = {}


const limit = 9

const ProductHistory = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const [allPigs, setAllPigs] = useState<any[]>(props.allPigs)
  const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.small_list_pagination_limit ? props.settings.small_list_pagination_limit : limit })
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const [total, setTotal] = useState<number>(Number(props.total))
  const [count, setCount] = useState<number>(Number(props.count));
  const [loading, setLoading] = useState<boolean>(false)
  const [viewPigData, setViewPigData] = useState(initialValues)
  const [currentEdit, setCurrentEdit] = useState(initialValues)
  console.log(allPigs);

  const currentUniqueId = useRef<string>('');
  let timeOutFn: any
  // const viewPigData = useRef<string>('');

  //TODO: pig edit, delete, view button functionality

  function deletePigData(uniqueId: string) {
    currentUniqueId.current = uniqueId
    setShowModal(true)
    setSuccess('')
    setError('')
  }



  useEffect(() => {
    //if (pagination.page === props.page) return
    (async () => await fetchPigDetailsWithPagination(pagination.limit, pagination.page))()
    setError(null)
    setSuccess(null)
  }, [pagination.limit, pagination.page, props.page])

  // update value construction



  const initialUpdateValues: any = {
    id: currentEdit.id,
    breeding_details: currentEdit.breeding_details,
    unique_id: currentEdit.unique_id,
    tag_no: currentEdit.tag_no,
    age: currentEdit.age,
    weight: currentEdit.weight,
    gender: currentEdit.gender,
    fathers_tagNo: currentEdit.fathers_tagNo,
    mothers_tagNo: currentEdit.mothers_tagNo,
    predictive_pregnancy: currentEdit.predictive_pregnancy,
    batch_no: currentEdit.batch_no,
    sold: currentEdit.sold,
    price: currentEdit.price,
    grouping: currentEdit.grouping,
    is_ade3h_inj: currentEdit.is_ade3h_inj,
    expected_deworming_date: currentEdit.expected_deworming_date ? editDateFormat(currentEdit.expected_deworming_date) : null,
    is_deworming: currentEdit.is_deworming,
    is_amoxicillin: currentEdit.is_amoxicillin,
    is_deliveryRoomClean: currentEdit.is_deliveryRoomClean,
    is_bitadinespray: currentEdit.is_bitadinespray,
    delivery_room_sentExpectedDate: currentEdit.delivery_room_sentExpectedDate ? editDateFormat(currentEdit.delivery_room_sentExpectedDate) : null,
    expected_deliveryDate: currentEdit.expected_deliveryDate ? editDateFormat(currentEdit.expected_deliveryDate) : null,
    expected_amoxcillin_powderDate: currentEdit.expected_amoxcillin_powderDate ? editDateFormat(currentEdit.expected_amoxcillin_powderDate) : null,
    expected_bitadinespray_date: currentEdit.expected_bitadinespray_date ? editDateFormat(currentEdit.expected_bitadinespray_date) : null,
    actual_deliverydate: currentEdit.actual_deliverydate ? editDateFormat(currentEdit.actual_deliverydate) : null,
    no_ofPiglet: currentEdit.no_ofPiglet,
    no_of_male: currentEdit.no_of_male,
    no_of_female: currentEdit.no_of_female,
    saw_id: currentEdit.saw_id,
    boar_id: currentEdit.boar_id,
    first_heatDate: currentEdit.first_heatDate ? editDateFormat(currentEdit.first_heatDate) : null,
    second_heatDate: currentEdit.second_heatDate ? editDateFormat(currentEdit.second_heatDate) : null,
    third_heatDate: currentEdit.third_heatDate ? editDateFormat(currentEdit.third_heatDate) : null,
    first_crossingDate: currentEdit.first_crossingDate ? editDateFormat(currentEdit.first_crossingDate) : null,
    is_rechockAfterFirstCrossingDate: editDateFormat(currentEdit.is_rechockAfterFirstCrossingDate),
    second_crossingDate: currentEdit.second_crossingDate ? editDateFormat(currentEdit.second_crossingDate) : null,
    expected_1stade3hInjDate: currentEdit.expected_1stade3hInjDate ? editDateFormat(currentEdit.expected_1stade3hInjDate) : null,
    is_1stAde3h: currentEdit.is_1stAde3h,
    expected_2ndade3hInjDate: currentEdit.expected_2ndade3hInjDate ? editDateFormat(currentEdit.expected_2ndade3hInjDate) : null,
    date_of_lic_startedDate: currentEdit.date_of_lic_startedDate ? editDateFormat(currentEdit.date_of_lic_startedDate) : null,
    is_2ndAde3h: currentEdit.is_2ndAde3h,
    whichPregnancy: currentEdit.whichPregnancy
  }

  // ----------------------------


  async function handleSubmit(values: any, actions: any) {
    setError(null)
    setSuccess(null)
    setLoading(true)
    console.log(values);

    // if (values.fathers_tagNo) {
    //   values.fathers_tagNo = values.fathers_tagNo.value
    // }
    // if (values.mothers_tagNo) {
    //   values.mothers_tagNo = values.mothers_tagNo.value
    // }
    if (values.whichPregnancy) {
      values.whichPregnancy = +values.whichPregnancy
    }

    try {
      const pigData = await updatePig(values)

      if (pigData) {
        setAllPigs(data => data.map(val => {
          if (val.id !== pigData.id) return val
          return pigData
        }))
        setSuccess("Pig data is added successfully!")
      }
      actions.resetForm()
    } catch (error: any) {
      setError(error.message)
      console.log(error.message);

    } finally {
      setLoading(false)
      if (timeOutFn) clearTimeout(timeOutFn)
      timeOutFn = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 10000)
    }
  }


  async function fetchPigDetailsWithPagination(limit: number, page: number) {
    setError(null)
    try {
      const url = `/pig${paginationUrl({ l: props.settings.default_pagination_limit || limit, p: page })}`;
      const res = await axiosHandler.get(url)
      if (res.data.status !== 'ok') {
        throw new Error(res.data.message)
      }
      // pageProps.allAssignMedicine = res.data.data
      setAllPigs(res.data.data)
      setTotal(res.data.total)
      setCount(res.data.count)

    } catch (error: any) {
      const msg = error?.response?.data?.message ? error?.response?.data?.message : error?.message
      console.log(msg);
      setError(msg);
    }
  }

  async function deletePigDataConfirmation(uniqueId: string) {
    try {
      const url = '/pig/'
      const res = await axiosHandler.delete(url, { data: { uniqueId } });
      if (res.data.status !== 'ok') throw new Error(res.data.message)
      setAllPigs(val => val.filter(data => data.unique_id !== uniqueId))
      setSuccess("Data is deleted successfully")
    } catch (error: any) {
      setError(error?.response?.data?.message ? error?.response?.data?.message : error.message)
    }
    setShowModal(false)
  }

  const tableData = allPigs.map((val) => <React.Fragment key={val.unique_id}> <tr>
    {/* const tableData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((val) => <React.Fragment key={val}> <tr> */}
    <td>{val.unique_id}</td>
    <td>{val.breeding_details}</td>
    <td>{val.tag_no}</td>
    <td>{val.age}</td>
    <td>{val.weight}</td>
    <td>{val.gender}</td>
    <td>
      <div className={`badge ${val.predictive_pregnancy ? `badge-success` : `badge-error`}  p-4 text-[#fff]`}>{val.predictive_pregnancy ? 'Success' : 'Failed'} </div>
    </td>
    <td>{val.grouping}</td>
    <td>{val.fathers_tagNo ?? "NIL"}</td>
    <td>{val.mothers_tagNo ?? "NIL"}</td>

    {/* TODO: pig sold or not */}
    <td><div className={`badge ${val.sold ? `badge-success` : `bg-orange-500 border-orange-500`}  p-4 text-[#fff]`}>{val.sold ? 'Sold' : 'Not sold'} </div></td>
    <td className='flex gap-2 justify-center'>
      {/* view */}
      <label htmlFor={`view-pig-details-modal-${viewPigData.id}`} className='btn-primary text-lg opacity-50 btn-circle flex justify-center items-center cursor-pointer'
        onClick={() => setViewPigData(val)}
      >
        <FaEye className='text-lg ' />
      </label>
      {/* delete */}
      <Button type='button' onClick={() => deletePigData(val.unique_id)} className='btn-primary text-lg opacity-50 btn-circle cursor-pointer'>
        <label htmlFor={currentUniqueId.current} className='w-full h-full flex justify-center items-center  cursor-pointer'>
          <BsFillTrash3Fill className='text-lg' />
        </label>
      </Button>
      {/* edit */}
      <Button type='button' className='btn-primary text-lg opacity-50 btn-circle'
        onClick={() => {
          //@ts-ignore
          setCurrentEdit(val)
        }}
      >
        <label htmlFor="edit-pig-details-modal" className='w-full h-full flex justify-center items-center  cursor-pointer'><FiEdit2 className='text-lg ' />
        </label>
      </Button>
    </td>

  </tr>
  </React.Fragment>)

  const lastpage = Math.floor(count / pagination.limit)


  const colonCss = ' hover:bg-black hover:bg-opacity-5 hover:text-black'
  const attributeValueCss = `text-3xl h-10 whitespace-nowrap `
  const attributeCss = `font-bold ${attributeValueCss} `;



  const viewPigDetails = <Modal id={`view-pig-details-modal-${viewPigData.id}`} className=' max-w-[45rem] max-h-[50rem]' >

    <div className="w-full h-full overflow-y-auto flex justify-center">
      {/* <div className="w-full overflow-y-auto"> */}
      <table className="table">
        {/* head */}
        <thead>
          <tr className='sticky'>
            <th></th>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th>1</th>
            <td className={attributeCss}>Breeding Details</td>
            <td className={attributeValueCss}>{viewPigData.breeding_details}</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th>2</th>
            <td className={attributeCss}>Unique Id</td>
            <td className={attributeValueCss}>{viewPigData.unique_id}</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th>3</th>
            <td className={attributeCss}>Tag No</td>
            <td className={attributeValueCss}>{viewPigData.tag_no}</td>
          </tr>
          {/* row 4 */}
          <tr>
            <th>4</th>
            <td className={attributeCss}>Age</td>
            <td className={attributeValueCss}>{viewPigData.age}</td>
          </tr>
          {/* row 5 */}
          <tr>
            <th>5</th>
            <td className={attributeCss}>Weight</td>
            <td className={attributeValueCss}>{viewPigData.weight}</td>
          </tr>
          {/* row 6 */}
          <tr>
            <th>6</th>
            <td className={attributeCss}>Gender</td>
            <td className={attributeValueCss}>{viewPigData.gender}</td>
          </tr>
          {/* row 7 */}
          <tr>
            <th>7</th>
            <td className={attributeCss}>Father's Tag No</td>
            <td className={attributeValueCss}>{viewPigData.fathers_tagNo}</td>
          </tr>
          {/* row 8 */}
          <tr>
            <th>8</th>
            <td className={attributeCss}>Mother's Tag No</td>
            <td className={attributeValueCss}>{viewPigData.mothers_tagNo}</td>
          </tr>
          {/* row 9 */}
          <tr>
            <th>9</th>
            <td className={attributeCss}>Predictive Pregnancy</td>
            <td className={attributeValueCss}>{viewPigData.predictive_pregnancy ? "Completed" : "Failed"}</td>
          </tr>
          {/* row 10 */}
          <tr>
            <th>10</th>
            <td className={attributeCss}>Batch No</td>
            <td className={attributeValueCss}>{viewPigData.batch_no}</td>
          </tr>
          {/* row 11 */}
          <tr>
            <th>11</th>
            <td className={attributeCss}>Sold</td>
            <td className={attributeValueCss}>{viewPigData.sold ? "Sold" : "Not Sold"}</td>
          </tr>
          {/* row 12 */}
          <tr>
            <th>12</th>
            <td className={attributeCss}>Grouping</td>
            <td className={attributeValueCss}>{viewPigData.grouping}</td>
          </tr>

          {/* row 13 */}
          <tr>
            <th>13</th>
            <td className={attributeCss}>Is Ade3h Inj</td>
            <td className={attributeValueCss}>{viewPigData.is_ade3h_inj ? "Yes" : "No"}</td>
          </tr>
          {/* row 14 */}
          <tr>
            <th>14</th>
            <td className={attributeCss}>Expected Deworming Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.expected_deworming_date!)}</td>
          </tr>
          {/* row 15 */}
          <tr>
            <th>15</th>
            <td className={attributeCss}>Is Deworming</td>
            <td className={attributeValueCss}>{viewPigData.is_deworming ? "Yes" : "No"}</td>
          </tr>
          {/* row 16 */}
          <tr>
            <th>16</th>
            <td className={attributeCss}>Delivery Room Sent Expected Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.delivery_room_sentExpectedDate!)}</td>
          </tr>
          {/* row 17 */}
          <tr>
            <th>17</th>
            <td className={attributeCss}>Is Delivery Room Clean</td>
            <td className={attributeValueCss}>{viewPigData.is_deliveryRoomClean ? "Yes" : "No"}</td>
          </tr>
          {/* row 18 */}
          <tr>
            <th>18</th>
            <td className={attributeCss}>Expected Delivery Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.expected_deliveryDate!)}</td>
          </tr>
          {/* row 19 */}
          <tr>
            <th>19</th>
            <td className={attributeCss}>Expected Amoxcillin Powder Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.expected_amoxcillin_powderDate!)}</td>
          </tr>
          {/* row 20 */}
          <tr>
            <th>20</th>
            <td className={attributeCss}>Is Amoxicillin</td>
            <td className={attributeValueCss}>{viewPigData.is_amoxicillin ? "Yes" : "No"}</td>
          </tr>
          {/* row 21 */}
          <tr>
            <th>21</th>
            <td className={attributeCss}>Expected Bitadinespray Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.expected_bitadinespray_date!)}</td>
          </tr>
          {/* row 22 */}
          <tr>
            <th>22</th>
            <td className={attributeCss}>Is Bitadine Spray</td>
            <td className={attributeValueCss}>{viewPigData.is_bitadinespray ? "Yes" : "No"}</td>
          </tr>
          {/* row 23 */}
          <tr>
            <th>23</th>
            <td className={attributeCss}>Actual Delivery Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.actual_deliverydate!)}</td>
          </tr>
          {/* row 24 */}
          <tr>
            <th>24</th>
            <td className={attributeCss}>No Of Piglet</td>
            <td className={attributeValueCss}>{viewPigData.no_ofPiglet}</td>
          </tr>
          {/* row 25 */}
          <tr>
            <th>25</th>
            <td className={attributeCss}>No Of Male</td>
            <td className={attributeValueCss}>{viewPigData.no_of_male}</td>
          </tr>
          {/* row 26 */}
          <tr>
            <th>26</th>
            <td className={attributeCss}>No Of Female</td>
            <td className={attributeValueCss}>{viewPigData.no_of_female}</td>
          </tr>
          {/* row 27 */}
          <tr>
            <th>27</th>
            <td className={attributeCss}>Saw Id</td>
            <td className={attributeValueCss}>{viewPigData.saw_id}</td>
          </tr>
          {/* row 28 */}
          <tr>
            <th>28</th>
            <td className={attributeCss}>Boar Id</td>
            <td className={attributeValueCss}>{viewPigData.boar_id}</td>
          </tr>
          {/* row 29 */}
          <tr>
            <th>29</th>
            <td className={attributeCss}>First Heat Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.first_heatDate!)}</td>
          </tr>
          {/* row 30 */}
          <tr>
            <th>30</th>
            <td className={attributeCss}>Second Heat Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.second_heatDate!)}</td>
          </tr>
          {/* row 31 */}
          <tr>
            <th>31</th>
            <td className={attributeCss}>Third Heat Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.third_heatDate!)}</td>
          </tr>
          {/* row 32 */}
          <tr>
            <th>32</th>
            <td className={attributeCss}>First Crossing Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.first_crossingDate!)}</td>
          </tr>
          {/* row 33 */}
          <tr>
            <th>33</th>
            <td className={attributeCss}>First Crossing Date</td>
            <td className={attributeValueCss}>{viewPigData.is_rechockAfterFirstCrossingDate ? "Yes" : "No"}</td>
          </tr>
          {/* row 34 */}
          <tr>
            <th>34</th>
            <td className={attributeCss}>Second Crossing Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.second_crossingDate!)}</td>
          </tr>
          {/* row 35 */}
          <tr>
            <th>35</th>
            <td className={attributeCss}>Expected First ade3hInj Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.expected_1stade3hInjDate!)}</td>
          </tr>
          {/* row 36 */}
          <tr>
            <th>36</th>
            <td className={attributeCss}>Is First Ade3h</td>
            <td className={attributeValueCss}>{viewPigData.is_1stAde3h ? "Yes" : "No"}</td>
          </tr>
          {/* row 37 */}
          <tr>
            <th>37</th>
            <td className={attributeCss}>Expected second ade3h Inj Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.expected_2ndade3hInjDate!)}</td>
          </tr>
          {/* row 37 */}
          <tr>
            <th>37</th>
            <td className={attributeCss}>Date of lic started Date</td>
            <td className={attributeValueCss}>{shortDate(viewPigData.date_of_lic_startedDate!)}</td>
          </tr>
          {/* row 38 */}
          <tr>
            <th>38</th>
            <td className={attributeCss}>Is Second Ade3h</td>
            <td className={attributeValueCss}>{viewPigData.is_2ndAde3h ? "Yes" : "No"}</td>
          </tr>


        </tbody>
      </table>
      {/* </div> */}
    </div>
  </Modal>

  return (
    <>
      {/* edit pig details */}
      {viewPigDetails}
      <Modal id="edit-pig-details-modal" className=' max-w-5xl' >
        <EditPigForm
          // initialValues={initialValues}
          isEdit={true}
          // @ts-ignore 
          pigUpdateData={initialUpdateValues}
          handleSubmit={handleSubmit}
          batchList={props.batchList}
          loading={loading}
          parentTagNo={props.parentTagNo}
        />
      </Modal>

      {error && <MyToast type="error" message={error} />}
      {success && <MyToast type="success" message={success} />}

      {showModal &&
        <Modal show={false} id={currentUniqueId.current}>
          <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
          <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>
          {/* <h2 className='text-[1.5rem] text-center'>Unique ID: {currentUniqueId.current} </h2> */}
          <div className='flex w-full justify-evenly'>
            <label htmlFor={currentUniqueId.current} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button></label>


            <Button className='btn-error' type='button' onClick={() => deletePigDataConfirmation(currentUniqueId.current)} >Delete</Button>
          </div>
        </Modal>
      }

      {/* <div className='w-full h-full mx-5 pr-5'> */}
      <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
        <h1 className='text-3xl font-semibold'>Added pig's details</h1>
        <button className='btn btn-outline btn-primary text-lg'>
          <Link href={{ pathname: "/product-history/add-pig" }} >Add A PIG</Link>
        </button>
      </div>

      {/* <div className='w-full'> */}
      <CardLayout className='w-full h-[70vh] overflow-auto '>
        <table className="table bg-[--background-white] hover:bg-[--background-white] capitalize relative">
          {/* head */}
          <thead className='h-15 capitalize sticky '>
            <tr >
              {/* total 12 columns */}
              <th>Unique ID</th>
              <th className=''>Breeding Details </th>
              <th>Tag No</th>
              <th>Age (days)</th>
              <th>Weight (kg)</th>
              <th>Gender</th>
              <th>Predictive Pregnancy</th>
              <th>Groupings</th>
              <th>Father's Tag No</th>
              <th>Mother's Tag No</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {tableData}
          </tbody>
        </table>
        {allPigs.length === 0 && <div className='w-full h-full flex justify-center items-center'> <h1 className='text-center font-bold text-2xl'>No Data Available</h1></div>}
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

          <Button type="button" className="btn btn-primary btn-lg" onClick={() => fetchPigDetailsWithPagination(pagination.limit, pagination.page)}>
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

export default ProductHistory;


type PageProps = {
  user?: jwtUser;
  allPigs: any[];
  batchList: any[];
  total: number;
  page: number;
  count: number;
  parentTagNo: any;
  settings?: any;
}

export async function getServerSideProps(context: any) {

  const p = 0
  const pageProps: PageProps = {
    allPigs: [],
    batchList: [],
    total: 0,
    count: 0,
    parentTagNo: {},
    page: context?.query.p ? context?.query.p : 0,

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


  const take = pageProps?.settings?.default_pagination_limit ? pageProps.settings.default_pagination_limit : limit

  try {
    const url = '/pig' + paginationUrl({ l: take, p: pageProps.page })
    const response = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })

    if (response.data.status === "fail") throw new Error(response.data.message)
    pageProps.allPigs = response.data.data
    pageProps.total = response.data.total
    pageProps.page = response.data.page
    pageProps.count = response.data.count
  } catch (error: any) {
    console.log(error.response?.data.message ? error.response?.data.message : error.message);
  }

  try {
    //fetch using axios
    const url = '/pig/all-batch';
    const res = await systemAxios.get(url)

    if (res.data.status !== 'ok') throw new Error(res.data.message)
    pageProps.batchList = res.data.data
  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);

  }

  try {
    const url = '/pig/get-pigs-by-tag';
    const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })
    pageProps.parentTagNo = res.data.data
  } catch (error: any) {
    console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
  }



  return {
    props: pageProps, // will be passed to the page component as props
  };
}





const initialValues = {
  id: 0,
  breeding_details: null,
  unique_id: null,
  tag_no: null,
  age: null,
  weight: null,
  gender: "",
  fathers_tagNo: null,
  mothers_tagNo: null,
  whichPregnancy: null,
  predictive_pregnancy: "",
  batch_no: "",
  sold: "",
  price: 0,
  grouping: null,
  is_ade3h_inj: "",
  expected_deworming_date: null,
  is_deworming: "",
  delivery_room_sentExpectedDate: null,
  is_deliveryRoomClean: "",
  expected_deliveryDate: null,
  expected_amoxcillin_powderDate: null,
  is_amoxicillin: "",
  expected_bitadinespray_date: null,
  is_bitadinespray: "",
  actual_deliverydate: null,
  no_ofPiglet: null,
  no_of_male: null,
  no_of_female: null,
  saw_id: null,
  boar_id: null,
  first_heatDate: null,
  second_heatDate: null,
  third_heatDate: null,
  first_crossingDate: null,
  is_rechockAfterFirstCrossingDate: "",
  second_crossingDate: null,
  expected_1stade3hInjDate: null,
  is_1stAde3h: "",
  expected_2ndade3hInjDate: null,
  date_of_lic_startedDate: null,
  is_2ndAde3h: ""
}
