import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import React, { useEffect, useRef, useState } from 'react';

import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { onBlurHandler } from '@/utils/UIHelper';
import { TextInput } from '@/UI/input/TextInput';
import Loader from '@/UI/Loader/Loader';
import Modal from '@/UI/Modal/modal';
import { Form, Formik } from 'formik';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import Select from '@/UI/select/Select';
import { object, string, number, boolean, date } from 'yup';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import { paginationUrl } from '@/utils/helperfuncFrontend';
import { editDateTimeFormat, shortDate } from '@/utils/dateFormat';
import MyToast from '@/UI/MyToast';
import { getFeedInventoryNames } from '@/utils/apiRequests';
import { jwtUser } from '@/types/auth';

type Props = {}
const limit = 9

interface Values {
    feed_name: string,
    feed_type: string,
    select_type: string,
    batch_no?: string | undefined,
    tag_no?: string | undefined,
    quantity: number,
    cost: number,
    date: Date,
};


const FeedPlaner = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const [error, setError] = useState<null | string>(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [pageData, setPageData] = useState(props.feedPlaner || [])
    const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props?.settings?.default_pagination_limit ? props.settings.default_pagination_limit : limit })
    const [total, setTotal] = useState<number>(Number(props.total))
    const [count, setCount] = useState<number>(Number(props.count))
    const [showModal, setShowModal] = useState(false);
    const [currentEdit, setCurrentEdit] = useState({
        id: 0,
        feed_name: "",
        feed_type: "",
        select_type: "",
        batch_no: "",
        tag_no: "",
        quantity: "",
        cost: "",
        date: new Date()
    })
    let timeOutCleaningPostRequest: any;
    let timeOutCleaningDeleteRequest: any;
    let timeOutCleaningUpdateRequest: any;

    const currentUniqueId = useRef<number>();

    const feedName = props.feedName.map(val => ({ value: val.feed_name, title: val.feed_name }))

    useEffect(() => {
        //if (pagination.page === props.page) return
        (async () => await fetchPageDetailsWithPagination(pagination.limit, pagination.page))()
        setError(null)
        setSuccess(null)
    }, [pagination.limit, pagination.page, props.page])


    async function fetchPageDetailsWithPagination(limit: number, page: number) {
        setError(null)


        try {
            const url = '/feed/planer' + paginationUrl({ l: limit, p: page })
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
            if (timeOutCleaningUpdateRequest) clearTimeout(timeOutCleaningUpdateRequest)
            timeOutCleaningUpdateRequest = setTimeout(() => {
                setSuccess(null)
                setError(null)
            }, 10000);
        }
    }



    const lastpage = Math.floor(count / pagination.limit)

    const batchDetails = props.batchList.map(val => ({ value: val.batch, title: val.batch }));
    const tagDetails = props.tags.map(val => ({ value: val, title: val }));


    const validationSchema = object({
        feed_name: string().required("Feed name is Required"),
        feed_type: string().required("Feed type is Required"),
        quantity: number().min(0, "Quantity should not be less than 0").positive().required("Quantity is Required"),
        cost: number().min(0, "Cost should not be less than 0").positive().required("Cost is Required"),
        date: date().required("Please select a valid date"),
    });

    function deleteFeedData(id: number) {
        currentUniqueId.current = id
        setShowModal(true)
        setSuccess('')
        setError('')
    }


    // const tableData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => <React.Fragment key={val}> <tr>
    const tableData = pageData.map((val) => <React.Fragment key={val}> <tr>
        <td>{val.feed_name}</td>
        <td>{val.batch_no ? val.batch_no : val.tag_no}</td>
        <td>{val.quantity}</td>
        <td>{val.cost}</td>
        <td>{shortDate(val.date)}</td>
        <td><div className={`badge ${val.status === "pending" ? `bg-orange-500 border-orange-500` : `badge-success`}  p-4 text-[#fff]`}>{val.status === "pending" ? 'Pending' : 'Complete'} </div></td> {/* Complete, Pending, Low stock */}
        <td className='flex gap-2 justify-center'>
            <Button type='button' onClick={() => deleteFeedData(val.id)} className='btn-primary text-lg opacity-50 btn-circle cursor-pointer'>
                <label htmlFor={`${currentUniqueId.current}`} className='w-full h-full flex justify-center items-center cursor-pointer'>
                    <BsFillTrash3Fill className='text-lg' />
                </label>
            </Button>
            <Button type='button' className='btn-primary text-lg opacity-50 btn-circle'
                onClick={() => {
                    setCurrentEdit(val)
                }}
            >
                <label id="label-edit-assign-feed-modal" htmlFor="edit-assign-feed-modal" className='w-full h-full flex justify-center items-center  cursor-pointer'><FiEdit2 className='text-lg ' /></label>
            </Button>
        </td>
    </tr>
    </React.Fragment>)

    async function deleteFeedPlanerConfirmation(id: number) {
        try {
            const url = '/feed/planer/' + id
            const res = await axiosHandler.delete(url);
            if (res.data.status !== 'ok') throw new Error(res.data.message)
            setPageData(val => val.filter(data => data.id !== id))
            setSuccess("Data is deleted successfully")
        } catch (error: any) {
            setError(error?.response?.data?.message ? error?.response?.data?.message : error.message)
        } finally {
            setShowModal(false)
            if (timeOutCleaningDeleteRequest) clearTimeout(timeOutCleaningDeleteRequest)
            timeOutCleaningDeleteRequest = setTimeout(() => {
                setSuccess(null)
                setError(null)
            }, 10000);
        }
    }


    const editModelRequest = <Modal id="edit-assign-feed-modal" className='max-w-5xl' >
        <h3 className="text-4xl font-bold mb-5">Edit assigned Feed</h3>
        <Formik
            initialValues={{
                id: currentEdit.id,
                feed_name: currentEdit.feed_name,
                feed_type: currentEdit.feed_type,
                select_type: currentEdit?.batch_no ? 'batch' : currentEdit?.tag_no ? 'individual' : "",
                batch_no: currentEdit?.batch_no ? currentEdit : null,
                quantity: currentEdit.quantity,
                cost: currentEdit.cost,
                tag_no: currentEdit?.tag_no ? currentEdit : null,
                date: editDateTimeFormat(currentEdit.date)
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
                setError(null)
                setSuccess(null)
                setLoading(true)
                //@ts-ignore
                values.date = new Date(values.date)
                if (values.select_type === "batch") {
                    //@ts-ignore
                    values.tag_no = null;
                } else {
                    //@ts-ignore
                    values.batch_no = null;
                }
                // delete values.select_type
                try {
                    const response = await axiosHandler.put('/feed/planer', values)
                    if (response.data.status !== 'ok') throw new Error(response.data.message)
                    const feed = response.data.data
                    setPageData(val => val.map(data => {
                        if (data.id !== feed.id) return data
                        return feed
                    }))
                    // if (medicine) {
                    actions.resetForm()
                    setSuccess("Feed assigned successfully !")
                    // }
                    document?.getElementById('label-edit-assign-feed-modal')?.click()

                } catch (error: any) {
                    console.log(error.response?.data.message)
                    setError(error.response?.data.message)
                } finally {
                    setLoading(false)
                    if (timeOutCleaningPostRequest) clearTimeout(timeOutCleaningPostRequest)
                    timeOutCleaningPostRequest = setTimeout(() => {
                        setError(null)
                        setSuccess(null)
                    }, 10000)
                }

            }}
        >
            {/* @ts-ignore */}
            {(props: FormikProps<Values>) => (
                <Form className="form-control my-auto w-full h-full py-5 px-3">

                    <Select name="feed_name"
                        className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                        title='Select Feed Name'
                        options={feedName}
                    />

                    <Select name='feed_type'
                        className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                        title='Feed Type'
                        // TODO:add 4 type of feed type in backend, then make api
                        options={[
                            { value: 'Creep', title: 'Creep' },
                            { value: 'Starter', title: 'Starter' },
                            { value: 'Grower', title: 'Grower' },
                            { value: 'Finisher', title: 'Finisher' }
                        ]}
                    />


                    <Select name='select_type'
                        className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                        title='Select Batch or Individual Type'
                        // TODO:add 4 type of feed type in backend, then make api
                        options={[{ value: 'batch', selected: true, title: 'Batch' }, { value: 'individual', title: 'Individual' }]}
                    />


                    {props.values.select_type === "batch" ? <Select name='batch_no'
                        className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                        title='Batch No'
                        options={batchDetails}
                    /> :
                        <Select name='tag_no'
                            className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                            title='Tag No'
                            options={tagDetails}
                        />
                    }

                    <TextInput
                        placeholder="Quantity"
                        type="number"
                        name="quantity"
                        className="my-1 text-[1.5rem] bg-[#F5F5F5]"
                    />
                    <TextInput
                        placeholder="Cost"
                        type="number"
                        name="cost"
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



    return (
        <>

            {error && <MyToast type="error" message={error} />}
            {success && <MyToast type="success" message={success} />}

            {editModelRequest}

            {showModal &&
                <Modal show={false} id={`${currentUniqueId.current}`}>
                    <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
                    <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>
                    {/* <h2 className='text-[1.5rem] text-center'>Unique ID: {currentUniqueId.current} </h2> */}
                    <div className='flex w-full justify-evenly'>
                        <label htmlFor={`${currentUniqueId.current}`} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button></label>

                        <Button className='btn-error' type='button' onClick={() => deleteFeedPlanerConfirmation(currentUniqueId.current!)}>Delete</Button>
                    </div>
                </Modal>
            }


            {/* <div className='w-full h-full '> */}
            <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
                <h1 className='text-3xl font-semibold'>Assigned feed</h1>
                {/* <Button type='button' className='btn-outline btn-primary'>ASSIGN FEED</Button> */}
                <label id="assign-feed-modal-label" htmlFor="assign-feed-modal" className='btn btn-outline btn-primary text-xl'>ASSIGN FEED</label>
            </div>


            {/* model for add assigned medicine */}
            <Modal id="assign-feed-modal" className='max-w-5xl' >
                <h3 className="text-4xl font-bold mb-5">Assign Feed</h3>
                <Formik
                    initialValues={{
                        feed_name: "",
                        feed_type: "",
                        select_type: "",
                        batch_no: "",
                        quantity: "",
                        cost: '',
                        tag_no: "",
                        date: ""
                    }}

                    validationSchema={validationSchema}
                    onSubmit={async (values, actions) => {
                        setError(null)
                        setSuccess(null)
                        setLoading(true)
                        //@ts-ignore
                        values.date = new Date(values.date)
                        if (values.select_type === "batch") {
                            //@ts-ignore
                            delete values.tag_no
                        } else {
                            //@ts-ignore
                            delete values.batch_no
                        }
                        // delete values.select_type
                        try {
                            const response = await axiosHandler.post('/feed/planer', values)
                            if (response.data.status !== 'ok') throw new Error(response.data.message)
                            const feed = response.data.data
                            setPageData(val => [feed, ...val])
                            // if (medicine) {
                            actions.resetForm()
                            setSuccess("Feed assigned successfully !")
                            // }
                            document?.getElementById('assign-feed-modal-label')?.click()

                        } catch (error: any) {
                            console.log(error.response?.data.message)
                            setError(error.response?.data.message)
                        } finally {
                            setLoading(false)
                            if (timeOutCleaningPostRequest) clearTimeout(timeOutCleaningPostRequest)
                            timeOutCleaningPostRequest = setTimeout(() => {
                                setError(null)
                                setSuccess(null)
                            }, 10000)
                        }
                    }}
                >
                    {/* @ts-ignore */}
                    {(props: FormikProps<Values>) => (
                        <Form className="form-control my-auto w-full h-full py-5 px-3">
                            <Select name="feed_name"
                                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                title='Select Feed Name'
                                options={feedName}
                            />

                            <Select name='feed_type'
                                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                title='Feed Type'
                                // TODO:add 4 type of feed type in backend, then make api
                                options={[
                                    { value: 'Creep', title: 'Creep' },
                                    { value: 'Starter', title: 'Starter' },
                                    { value: 'Grower', title: 'Grower' },
                                    { value: 'Finisher', title: 'Finisher' }
                                ]}
                            />


                            <Select name='select_type'
                                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                title='Select Batch or Individual Type'
                                // TODO:add 4 type of feed type in backend, then make api
                                options={[{ value: 'batch', selected: true, title: 'Batch' }, { value: 'individual', title: 'Individual' }]}
                            />


                            {props.values.select_type === "batch" ? <Select name='batch_no'
                                className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                title='Batch No'
                                options={batchDetails}
                            /> :
                                <Select name='tag_no'
                                    className='my-1 text-[1.5rem] bg-[#F5F5F5]'
                                    title='Tag No'
                                    options={tagDetails}
                                />
                            }

                            <TextInput
                                placeholder="Quantity"
                                type="number"
                                name="quantity"
                                className="my-1 text-[1.5rem] bg-[#F5F5F5]"
                            />
                            <TextInput
                                placeholder="Cost"
                                type="number"
                                name="cost"
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


            {/* <div className='w-full'> */}
            <CardLayout className='w-full h-[70vh] overflow-auto '>
                <table className="table bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
                    {/* head */}
                    <thead className='h-15 capitalize sticky '>
                        <tr >
                            {/* total 12 columns */}
                            <td>Food Name</td>
                            <td>Batch/tag </td>
                            <td>Quantity</td>
                            <td>Cost</td>
                            <td>Date</td>
                            <td>Status</td>
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

export default FeedPlaner;

type PageProps = {
    user?: jwtUser;
    batchList: any[];
    total: number;
    page: number;
    count: number;
    feedPlaner: any[];
    tags: string[];
    feedName: { id: number, feed_name: string, feed_type: string }[];
    settings?: any
}

export async function getServerSideProps(context: any) {

    const pageProps: PageProps = {
        batchList: [],
        total: 0,
        count: 0,
        page: context?.query.p ? context?.query.p : 0,
        feedPlaner: [],
        tags: [],
        feedName: [{ id: 0, feed_name: '', feed_type: '' }]
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
        const url = '/settings'
        const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
        if (res.data.status !== 'ok') return
        pageProps.settings = res.data.data
    } catch (error: any) {
        console.log(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
    }


    const take = pageProps?.settings?.default_pagination_limit ? pageProps.settings.default_pagination_limit : limit

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
        const url = '/feed/planer' + paginationUrl({ l: take, p: pageProps.page })
        const response = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })

        if (response.data.status === "fail") throw new Error(response.data.message)
        pageProps.feedPlaner = response.data.data
        pageProps.total = response.data.total
        pageProps.page = response.data.page
        pageProps.count = response.data.count
    } catch (error: any) {
        console.log(error.response?.data.message ? error.response?.data.message : error.message);
    }


    try {
        const url = '/pig/tags'
        const res = await systemAxios(url, { headers: axiosHeaderAuth(context) });
        if (res.data.status === "fail") throw new Error(res.data.message)
        pageProps.tags = res.data.data;
    } catch (error: any) {
        console.log(error.response?.data.message ? error.response?.data.message : error.message);
    }


    try {
        pageProps.feedName = await getFeedInventoryNames(context)
    } catch (error: any) {
        console.log(error.message);
    }

    return {
        props: pageProps, // will be passed to the page component as props
    };
}