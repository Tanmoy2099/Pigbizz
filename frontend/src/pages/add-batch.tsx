import React, { useEffect, useRef, useState } from 'react'
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import Button from '@/UI/Button/Button';
import Loader from '@/UI/Loader/Loader';
import { TextInput } from '@/UI/input/TextInput';
import { Form, Formik, FormikProps } from 'formik';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import CardLayout from '@/UI/Card/CardLayout';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
// import { Batch } from '@prisma/client';
import MyToast from '@/UI/MyToast';
import Modal from '@/UI/Modal/modal';
import { date, number, object, string } from 'yup';
import { jwtUser } from '@/types/auth';

type Props = {}

interface Values {
    batch: string;
}

const limit = 9
// const AddBatch = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const AddBatch = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [allBatch, setAllBatch] = useState(props.allBatch)
    const [error, setError] = useState<null | string>(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit })
    const [showModal, setShowModal] = useState(false);
    const [currentEdit, setCurrentEdit] = useState({ id: 0, batch: "" });

    const [total, setTotal] = useState<number>(Number(props.total))
    const [count, setCount] = useState<number>(Number(props.count));

    const currentBatch = useRef<string>('');
    const totalPigs = useRef<number>(0);
    const currentUniqueId = useRef<number>(0);

    const validationSchema = object({
        batch: string().required("Batch no. name is Required").matches(/^[a-zA-Z0-9]*$/u, 'Special Character not allowed').min(3, 'Batch no. should be more than or equal to 3 characters')
            .max(10, 'Batch no. should be less than or equal to 10 characters'), //~ @ # $ ^ & * ( ) - _ + = [ ] { } | \ , . ? :
    });

    async function deleteBatchData(batch: string) {
        currentBatch.current = batch
        setShowModal(true)
        setSuccess('')
        setError('')
        try {
            const url = `/pig/pigs-per-batch/${batch}`
            const res = await axiosHandler.get(url)
            if (res.data.status !== "ok") throw new Error(res.data.message)
            totalPigs.current = res.data.total;
        } catch (error: any) {
            setError(error?.response?.data?.message ? error?.response?.data?.message : error.message)
        }
    }

    const lastpage = Math.floor(count / pagination.limit);

    async function fetchBatchDetailsWithPagination(limit: number, page: number) {
        setError(null)
        try {
            const url = '/pig/all-batch' + paginationUrl({ l: props.settings.default_pagination_limit || limit, p: page });
            const res = await axiosHandler.get(url)
            if (res.data.status !== 'ok') {
                throw new Error(res.data.message)
            }

            setAllBatch(res.data.data)
            setTotal(res.data.total)
            setCount(res.data.count)

        } catch (error: any) {
            const msg = error?.response?.data?.message ? error?.response?.data?.message : error?.message
            console.log(msg);
            setError(msg);
        }
    }

    useEffect(() => {
        //if (pagination.page === props.page) return
        (async () => await fetchBatchDetailsWithPagination(pagination.limit, pagination.page))()
        setError(null)
        setSuccess(null)
    }, [pagination.limit, pagination.page, props.page])



    async function deleteBatchDataConfirmation(batch: string) {
        try {
            const url = '/pig/delete-batch'
            const res = await axiosHandler.delete(url, { data: { batch } });
            if (res.data.status !== 'ok') throw new Error(res.data.message)
            setAllBatch(val => val.filter(data => data.batch !== batch))
            setSuccess("Data is deleted successfully")
        } catch (error: any) {
            setError(error?.response?.data?.message ? error?.response?.data?.message : error.message)
        }
        setShowModal(false)
    }

    //TODO: show batch details
    //TODO: useEffect to fetch pagination
    //TODO: post batch data

    // const tableData = [0, 1, 2, 3, 4].map((val) => <React.Fragment key={val}> <tr>
    const tableData = allBatch.map((val) => <React.Fragment key={val.id}> <tr>
        <td>{val.batch}</td>
        <td className='flex gap-2 justify-center'>
            <Button type='button' onClick={() => deleteBatchData(val.batch)} className='btn-primary text-lg opacity-50 btn-circle'>
                <label htmlFor={currentBatch.current} className='w-full h-full flex justify-center items-center  cursor-pointer'>
                    <BsFillTrash3Fill className='text-lg' />
                </label>
            </Button>
            <Button type='button' onClick={() => {
                setCurrentEdit(val)
            }} className='btn-primary text-lg opacity-50 btn-circle'>
                <label id="label-edit-batch-modal" htmlFor="edit-batch-modal" className='w-full h-full flex justify-center items-center cursor-pointer'><FiEdit2 className='text-lg ' />
                </label>
            </Button>
        </td>
    </tr>
    </React.Fragment>)



    //TODO: get batch for next page use useEffect

    const editBatch = (<Modal id="edit-batch-modal" className='w-full md:min-w-fit md:w-[30rem]'>
        <CardLayout className='p-5 w-full h-fit max-w-sm mb-10'>
            <h3 className="text-4xl font-bold mb-5">Edit Batch</h3>
            <Formik
                initialValues={{
                    id: currentEdit.id,
                    batch: currentEdit.batch,
                }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={async (values, actions) => {

                    setError(null)
                    setSuccess(null)
                    setLoading(true)

                    try {
                        const url = '/pig/edit-batch'
                        const response = await axiosHandler.put(url, values)
                        if (response.data.status === "fail") throw new Error(response.data.message)
                        const batchObj = response.data.data
                        // actions.resetForm()
                        document?.getElementById('label-edit-batch-modal')?.click()
                        setSuccess(`Batch no. = ${batchObj.batch} is edited successfully!`)
                        //@ts-ignore
                        setAllBatch(value => value.map(val => +val.id === +batchObj.id ? batchObj : val));

                    } catch (error: any) {
                        setError(error.response?.data.message)
                    } finally {
                        setLoading(false)
                    }
                }}
            >
                {/* @ts-ignore */}
                {(props: FormikProps<Values>) => (
                    <Form className="form-control w-full h-full my-auto">
                        <TextInput
                            placeholder="Please Add Batch No."
                            type="text"
                            name="batch"
                            className="my-1 text-[1.5rem] bg-[#F5F5F5] mb-[2rem]"
                        />

                        <Button
                            type="submit"
                            className="btn-primary my-auto text-[1.2rem] h-[4rem]"
                            disabled={loading || Object.keys(props.errors).length > 0}
                        >
                            {loading ? <Loader /> : 'Add Batch'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </CardLayout>

    </Modal>
    )


    return (
        <>
            {error && <MyToast type="error" message={error} />}
            {success && <MyToast type="success" message={success} />}
            {editBatch}

            {showModal &&
                <Modal show={false} id={currentBatch.current}>
                    <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
                    <h2 className='text-[1.5rem] text-center text-error'>Total {totalPigs.current} pig{totalPigs.current && totalPigs.current > 1 ? 's' : ''} belong{totalPigs.current && totalPigs.current === 1 ? 's' : ''} to this batch {`(${currentBatch.current})`} will be deleted ! </h2>
                    <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure? </h2>
                    {/* <h2 className='text-[2rem] text-center'>Batch no: {currentBatch.current} </h2> */}
                    <div className='flex w-full justify-evenly'>
                        <label htmlFor={currentBatch.current} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button></label>


                        <Button className='btn-error' type='button' onClick={() => deleteBatchDataConfirmation(currentBatch.current)} >Delete</Button>
                    </div>
                </Modal>
            }

            <div className='flex flex-col gap-5 w-full md:flex-row justify-around items-center'>

                <CardLayout className='p-5 w-full h-fit max-w-md mb-10'>
                    <Formik
                        initialValues={{
                            batch: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, actions) => {

                            setError(null)
                            setSuccess(null)
                            setLoading(true)

                            try {
                                const url = '/pig/add-batch'
                                const response = await axiosHandler.post(url, values)
                                if (response.data.status === "fail") throw new Error(response.data.message)
                                const batchObj = response.data.data
                                actions.resetForm()
                                // setAllBatch(val => {
                                //     val.pop()
                                //     val.unshift(batchObj)
                                //     return val
                                // })
                                setAllBatch(val => [batchObj, ...val])
                                setSuccess(`Batch no. = ${batchObj.batch} is added successfully!`)


                            } catch (error: any) {
                                setError(error.response?.data.message)
                            } finally {
                                setLoading(false)
                            }
                        }}
                    >
                        {(props: FormikProps<Values>) => (
                            <Form className="form-control w-full h-full my-auto">
                                <TextInput
                                    placeholder="Please Add Batch No."
                                    type="text"
                                    name="batch"
                                    className="my-1 text-[1.5rem] bg-[#F5F5F5] mb-[2rem]"
                                />

                                <Button
                                    type="submit"
                                    className="btn-primary my-auto text-[1.2rem] h-[4rem]"
                                    disabled={loading || Object.keys(props.errors).length > 0}
                                >
                                    {loading ? <Loader /> : 'Add Batch'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardLayout>
                <div className='w-full max-w-lg h-fit'>
                    <CardLayout className={`w-full max-w-lg h-fit overflow-auto min-h-8 min-w-fit m-1 ${total === 0 && 'm-4 flex justify-center text-center'}`}>
                        {total === 0 ? <>
                            <h1>Sorry there is no {props.page > 0 && 'more'} batch no.</h1>
                        </> :
                            <table className="table table-compact bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
                                {/* head */}
                                <thead className='h-15 capitalize sticky '>
                                    <tr >
                                        {/* total 2 columns */}
                                        <td>Batch no.</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData}
                                </tbody>
                            </table>}
                    </CardLayout>

                    <div className="btn-group m-auto my-5 flex justify-center">
                        {pagination.page !== 0 &&
                            <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: 0 }))}>«</Button>}

                        {pagination.page > 1 && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: val.page - 2 }))}>
                            {pagination.page - 1}
                        </Button>}

                        {pagination.page > 2 && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: val.page - 1 }))}>
                            {pagination.page}
                        </Button>}

                        <Button type="button" className="btn btn-primary btn-lg" onClick={() => fetchBatchDetailsWithPagination(pagination.limit, pagination.page)}>
                            {pagination.page + 1}
                        </Button>

                        {(pagination.page < lastpage - 2) && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: lastpage - 2 }))}>{lastpage - 1}</Button>}

                        {(pagination.page < lastpage - 1) && <Button type="button" className="btn_page_lg btn-primary" onClick={() => setPagination(val => ({ ...val, page: lastpage }))}
                        >{lastpage - 1}</Button>}

                        {(pagination.page < lastpage) && <Button type="button"
                            onClick={() => setPagination(val => ({ ...val, page: lastpage }))}
                            className="btn_page_lg btn-primary">»</Button>}
                    </div>

                    {/* TODO: pagination buttons */}

                </div>
            </div>
        </>
    )
}

export default AddBatch

type PageProps = {
    user?: jwtUser;
    allBatch: any[];
    total: number;
    page: number;
    count: number;
    settings?: any;
}

export async function getServerSideProps(context: any) {

    const pageProps: PageProps = { allBatch: [], total: 0, page: 0, count: 0 }
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
    pageProps.user = jwtDecode<jwtUser>(token);

    try {
        pageProps.settings = await getSettings(context)
    } catch (error: any) {
        console.log(error.message);
    }

    try {
        const url = '/pig/all-batch' + paginationUrl({ l: pageProps.settings.default_pagination_limit, p: 0 });
        const response = await systemAxios.get(url, { headers: { Cookie: context.req.headers.cookie } });

        if (response.data.status === "fail") throw new Error(response.data.message)

        pageProps.allBatch = response.data.data
        pageProps.total = response.data.total
        pageProps.page = response.data.page
        pageProps.count = response.data.count
    } catch (error: any) {
        console.log(error.response?.data.message ? error.response?.data.message : error.message);
    }

    return {
        props: pageProps, // will be passed to the page component as props
    };
}