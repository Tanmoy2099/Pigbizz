import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/UI/Modal/modal';
import ValueCard from '@/UI/Card/ValueCard';
import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import { useField, Form, FormikProps, Formik } from "formik";
import { TextInput } from '@/UI/input/TextInput';

import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import Select from '@/UI/select/Select';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import { editDateFormat, shortDate } from '@/utils/dateFormat';
import Loader from '@/UI/Loader/Loader';
import { useRouter } from 'next/router';
import { object, string, number, date } from 'yup';
import MyToast from '@/UI/MyToast';
import { jwtUser } from '@/types/auth';


interface Values {
    medicine_name: string,
    medicine_type: string,
    cost: number | string,
    quantity: number | string,
    date: Date | string,
}


const limit = 5;

type Props = {}

const MedicineInventory = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [error, setError] = useState<null | string>(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [medicineStatus, setMedicineStatus] = useState(props.medicineStatus)
    const [pageData, setPageData] = useState(props.allMedicineTransaction || [])
    const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.small_list_pagination_limit ? props.settings.small_list_pagination_limit : limit })
    const [total, setTotal] = useState<number>(Number(props.total))
    const [count, setCount] = useState<number>(Number(props.count))
    const [showModal, setShowModal] = useState(false);
    const [currentEdit, setCurrentEdit] = useState({
        id: 0,
        medicine_name: "",
        medicine_type: "",
        cost: 0,
        quantity: 0,
        date: new Date()
    });

    const currentUniqueId = useRef<number>(0);
    const router = useRouter();

    useEffect(() => {
        //if (pagination.page === props.page) return
        (async () => await fetchPageDetailsWithPagination(pagination.limit, pagination.page))()
        setError(null)
        setSuccess(null)
    }, [pagination.limit, pagination.page, props.page])

    function deleteInventoryMedicineTransactionDataModel(uniqueId: number) {
        currentUniqueId.current = uniqueId

        setShowModal(true)
        setSuccess(null)
        setError(null)
    }


    async function fetchPageDetailsWithPagination(limit: number, page: number) {
        setError(null)
        try {
            const url = `/medicine-inventory${paginationUrl({ l: limit, p: page })}`;
            const res = await axiosHandler.get(url)
            if (res.data.status !== 'ok') {
                throw new Error(res.data.message);
            }
            // pageProps.allAssignMedicine = res.data.data
            // setPageData(res.data.data)
            setTotal(res.data.total)
            setCount(res.data.count)

        } catch (error: any) {
            const msg = error?.response?.data?.message ? error?.response?.data?.message : error?.message
            console.log(msg);
            setError(msg);
        }
    }

    const lastpage = Math.floor(count / pagination.limit);

    const validationSchema = object({
        medicine_name: string().required("Medicine name is Required"),
        medicine_type: string().required("Medicine type is Required"),
        cost: number().min(0, "price should not be less than 0").positive().required("cost is Required"),
        quantity: number().min(0, "price should not be less than 0").positive().required("quantity is Required"),
        date: date().required("Please select a valid date"),
    })


    async function updateStatus() {
        try {
            const url = `/medicine-inventory/status`;
            const res = await axiosHandler.get(url)
            if (res.data.status !== 'ok') {
                throw new Error(res.data.message)
            }
            setMedicineStatus(res.data.data)

        } catch (error: any) {
            console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
        }
    }

    const medicineTypeValues = props.medicineType.map(val => ({ value: val.type, title: val.type }));

    // const tableData = [0, 1, 2, 3, 4].map((val) => <React.Fragment key={val}> <tr>
    const tableData = pageData.map((val) => <React.Fragment key={val.id}> <tr>
        <td>{val.id}</td>
        <td>{shortDate(val.date)}</td>
        {/* <td>Lore lipsum</td> */}
        <td>{val.medicine_name}</td>
        <td>{val.quantity}</td>
        <td>₹{val.cost}</td>
        <td>₹{val.cost * val.quantity}</td>
        <td><div className={`badge ${val.quantity >= 20 ? `badge-success` : `bg-orange-500 border-orange-500`}  p-4 text-[#fff]`}>{val.quantity >= 20 ? 'In Stock' : 'Low Stock'}
        </div></td>
        <td className='flex gap-2 justify-center'>
            <Button
                onClick={() => deleteInventoryMedicineTransactionDataModel(val.id)}
                type='button' className='btn-primary text-lg opacity-50 btn-circle'>
                <label id={`model-${currentUniqueId.current}-label`} htmlFor={`model-${currentUniqueId.current}`} className='w-full h-full flex justify-center items-center  cursor-pointer'>
                    <BsFillTrash3Fill className='text-lg' />
                </label>
            </Button>
            <Button type='button' className='btn-primary text-lg opacity-50 btn-circle'
                onClick={() => {
                    setCurrentEdit(val)
                }}
            >
                <label id='edit-inventory-medicine-modal-label' htmlFor="edit-inventory-medicine-modal" className='w-full h-full flex justify-center items-center  cursor-pointer'><FiEdit2 className='text-lg ' /></label>
            </Button>
        </td>
    </tr>
    </React.Fragment>)

    //TODO: pagination, delete, edit
    function pageRoute(val: number) {
        return `/medicine-inventory?l=${val}`
    }

    async function deleteInventoryMedicineTransaction(id: number) {
        try {
            const url = '/medicine-inventory/' + id;
            const res = await axiosHandler.delete(url)
            if (res.data.status !== "ok") throw new Error(res.data.message)

            setSuccess('Deleted Successfully');
            setPageData((val: any) => val.filter((data: any) => data.id !== id));
            await fetchPageDetailsWithPagination(pagination.limit, pagination.page)
            document?.getElementById(`model-${currentUniqueId.current}-label`)?.click()

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

        await updateStatus()
    }


    return (
        <>
            {error && <MyToast type="error" message={error} />}
            {success && <MyToast type="success" message={success} />}

            {showModal &&
                <Modal show={false} id={`model-${currentUniqueId.current}`}>
                    <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
                    <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>

                    <div className='flex w-full justify-evenly'>
                        <label htmlFor={`model-${currentUniqueId.current}`} className="w-fit h-fit"><Button className='btn-primary' type='button'
                            onClick={() => setShowModal(false)}
                        >Cancel</Button>
                        </label>


                        <Button className='btn-error' type='button' onClick={() => deleteInventoryMedicineTransaction(currentUniqueId.current)} >Delete</Button>
                    </div>
                </Modal>
            }



            {/* <div className='w-[100%] h-full ml-5 mr-6'> */}
            <div className='flex flex-wrap md:flex-nowrap flex-row justify-between gap-2 mb-10'>
                {/* TODO: Today's use */}
                <ValueCard
                    title={'Today\'s use'}
                    value={'1254'}
                    backgroundColor='hsla(261, 98%, 66%, 0.15)'
                    valueColor='hsla(261, 80%, 50%, 1)'
                    svgColor='hsla(261, 80%, 50%, 0.3)'
                />
                {/* TODO: Last week use */}
                <ValueCard
                    title='Last week use'
                    value={'25125'}
                    backgroundColor='hsla(94, 100%, 40%, 0.3)'
                    valueColor='hsla(94, 99%, 30%, 1)'
                    svgColor='hsla(94, 100%, 40%, 0.15)'
                />
                {/* Stock left */}
                <ValueCard
                    title='Stock left'
                    value={medicineStatus.stockLeft}
                    backgroundColor='hsla(42, 100%, 50%, 0.3)'
                    valueColor='hsla(42, 100%, 44%, 1)'
                    svgColor='hsla(42, 100%, 50%, 0.15)'
                />
                {/* Running out items */}
                <ValueCard
                    title='Running out items'
                    value={medicineStatus.runningOut}
                    backgroundColor='hsla(200, 100%, 54%, 0.3)'
                    valueColor='hsla(200, 98%, 43%, 1)'
                    svgColor='hsla(200, 100%, 54%, 0.15)'
                />

            </div>
            <div className='flex flex-row justify-end items-center grow my-6 mx-4 gap-10'>
                {/* <div className='flex items-center justify-end gap-10'> */}
                {/* <Button type='button' className='btn-outline btn-primary'>Add medicine</Button> */}
                <label htmlFor="add-medicine-modal" className='btn btn-outline btn-primary'>Add medicine</label>
                {/* TODO: implement filter in frontend and backend */}
                <button className='btn btn-outline w-fit p-3 rounded-lg'>
                    <BiSortAlt2 className='px-2 rotate-90' />Filter & sort
                </button>
            </div>
            {/* </div> */}

            {/* <div className='w-full'> */}
            <CardLayout className='w-full h-fit overflow-auto '>
                <table className="table bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
                    {/* head */}
                    <thead className='h-15 capitalize sticky '>
                        <tr >
                            {/* total 7 columns */}
                            <th>Order ID</th>
                            <th>Purchase date</th>
                            <th>Medicine/dose</th>
                            <th>Quantity (pieces)</th>
                            <th>Cost (/pieces)</th>
                            <th>Total price</th>
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

                    {/* {pagination.page > 2 && <Button type="button" className="btn_page_lg btn-primary" onClick={() => router.push(pageRoute())}> */}
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
            {/* </div > */}


            {/* Put this part before </body> tag */}
            <Modal id="add-medicine-modal" className=' max-w-5xl'>
                <h3 className="text-4xl font-bold mb-5">Add Medicine</h3>
                <Formik
                    initialValues={{
                        medicine_name: "",
                        medicine_type: "",
                        cost: "",
                        quantity: "",
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
                            const response = await axiosHandler.post('/medicine-inventory', values)
                            if (response.data.status !== 'ok') throw new Error(response.data.message)
                            const medicine = response.data.data
                            setPageData(val => [medicine, ...val])
                            // if (medicine) {
                            actions.resetForm()
                            setSuccess("Medicine assigned successfully !")
                            // }


                        } catch (error: any) {
                            console.log(error.response?.data.message)
                            setError(error.response?.data.message)
                        } finally {
                            setLoading(false)
                            setTimeout(() => {
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
                                name="medicine_name"
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

                            <Select name='medicine_type'
                                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                title='Medicine Type'
                                options={medicineTypeValues}
                            />
                            <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
                        </Form>
                    )}
                </Formik>

            </Modal>




            {/* model for edit medicine inventory */}
            <Modal id="edit-inventory-medicine-modal" className='max-w-5xl'>
                <h3 className="text-4xl font-bold mb-5">Edit Inventory Medicine</h3>
                <Formik
                    initialValues={{
                        id: currentEdit.id,
                        medicine_name: currentEdit.medicine_name,
                        medicine_type: currentEdit.medicine_type,
                        cost: currentEdit.cost,
                        quantity: currentEdit.quantity,
                        date: editDateFormat(currentEdit.date)
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
                            const response = await axiosHandler.put('/medicine-inventory', values)
                            if (response.data.status !== 'ok') throw new Error(response.data.message)
                            const medicine = response.data.data[0]

                            setPageData(val => val.map(data => (data.id == medicine.id) ? medicine : data))

                            // if (medicine) {
                            actions.resetForm()
                            setSuccess("Medicine Details Edited Successfully !")
                            // }
                            document.getElementById('edit-inventory-medicine-modal-label')?.click()

                        } catch (error: any) {
                            console.log(error.response?.data.message)
                            setError(error.response?.data.message)
                        } finally {
                            setLoading(false)
                            setTimeout(() => {
                                setError(null)
                                setSuccess(null)
                            }, 10000)

                        }
                        await updateStatus()


                    }}
                >
                    {/* @ts-ignore */}
                    {(props: FormikProps<Values>) => (
                        <Form className="form-control my-auto w-full h-full py-5 px-3">
                            <TextInput
                                placeholder="Name"
                                type="text"
                                name="medicine_name"
                                disabled={true}
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

                            <Select name='medicine_type'
                                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                title='Medicine Type'
                                options={medicineTypeValues}
                            />
                            <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
                        </Form>
                    )}
                </Formik>
            </Modal >

        </>
        // </div>
    )
}

export default MedicineInventory;

type PageProps = {
    user?: jwtUser;
    medicineType: any[];
    allMedicineTransaction: any[];
    total: number;
    page: number;
    count: number;
    settings: any;
    medicineStatus: any
}

export async function getServerSideProps(context: any) {

    const pageProps: PageProps = {
        medicineType: [],
        allMedicineTransaction: [],
        total: 0,
        count: 0,
        page: context?.query.p ? context?.query.p : 0,
        settings: {},
        medicineStatus: {},
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
        //fetch using axios
        const url = '/assign-medicine/type';
        const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })

        if (res.data.status !== 'ok') throw new Error(res.data.message)
        pageProps.medicineType = res.data.data
    } catch (error: any) {
        console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);

    }



    try {
        pageProps.settings = await getSettings(context)
    } catch (error: any) {
        console.log(error.message);
    }

    const take = pageProps?.settings?.default_pagination_limit ? pageProps.settings.default_pagination_limit : limit

    try {
        // const url = `/assign-medicine?p=${pageProps.page}&l=${limit}`;
        const url = `/medicine-inventory${paginationUrl({ l: take, p: pageProps.page })}`;
        const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })
        if (res.data.status !== 'ok') {
            throw new Error(res.data.message)
        }
        pageProps.allMedicineTransaction = res.data.data
        pageProps.total = res.data.total
        pageProps.count = res.data.count

    } catch (error: any) {
        console.log(error?.response?.data?.message ? error?.response?.data?.message : error.message);
    }


    try {
        const url = `/medicine-inventory/status`;
        const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })
        if (res.data.status !== 'ok') {
            throw new Error(res.data.message)
        }
        pageProps.medicineStatus = res.data.data

    } catch (error: any) {
        console.log(error?.response?.data?.message ? error?.response?.data?.message : error.message);
    }

    return {
        props: pageProps, // will be passed to the page component as props
    };
}