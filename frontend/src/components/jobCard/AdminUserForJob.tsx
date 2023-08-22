import React, { useEffect, useRef, useState } from 'react';
import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';

import { useField, Form, FormikProps, Formik } from "formik";
import Link from "next/link";

import { FaEye } from 'react-icons/fa';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import { TextInput } from '@/UI/input/TextInput';
import { TextArea } from '@/UI/input/TextArea';
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { axiosHandler, systemAxios } from '@/utils/axiosHandler';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';
import SelectSearchGen from '@/UI/select/SelectSearchGen';
import { number, object, string } from 'yup';
import Loader from '@/UI/Loader/Loader';
import { getSettings, paginationUrl } from '@/utils/helperfuncFrontend';
import MyToast from '@/UI/MyToast';
import Modal from '@/UI/Modal/modal';

interface Values {
    assignee_id: any;
    assigned_id: any;
    task: string;
    remark: string;
}

const limit = 5
const AdminUserForJob = (props: any) => {

    const [error, setError] = useState<null | string>(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [pageData, setPageData] = useState(props?.pageData || [])
    const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: Number(props.page), limit: props.settings?.small_list_pagination_limit ? props.settings.small_list_pagination_limit : limit });
    const [total, setTotal] = useState<number>(Number(props.total));
    const [count, setCount] = useState<number>(Number(props.count));
    const [currentEdit, setCurrentEdit] = useState({
        id: -1,
        assigned_id: -1,
        task: "",
        remark: "",
    });



    let clearTime: any
    let timeOutCleaningUpdateRequest: any

    const validationSchema = object({
        assigned_id: number().required("Please select a user"),
        task: string().required("please provide a task")
    });

    //TODO: currently working, add useEffect
    useEffect(() => {
        //if (pagination.page === props.page) return
        (async () => await fetchPageDetailsWithPagination(pagination.limit, pagination.page))()
        setError(null)
        setSuccess(null)
    }, [pagination.limit, pagination.page, props.page])

    async function fetchPageDetailsWithPagination(limit: number, page: number) {
        setError(null)
        try {
            const url = '/tasks/assign-task' + paginationUrl({ l: limit, p: page });
            const res = await axiosHandler.get(url)
            if (res.data.status !== 'ok') {
                throw new Error(res.data.message)
            }
            setPageData(res.data.data)
            setTotal(res.data.total)
            setCount(res.data.count)

        } catch (error: any) {
            const msg = error.response?.data?.message ? error?.response?.data?.message : error?.message;
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
    // const lastpage = Math.floor(count / pagination.limit);
    const lastpage = Math.ceil(count / pagination.limit);
    const currentUniqueId = useRef<number>(0);


    function deleteTaskModel(uniqueId: number) {
        currentUniqueId.current = uniqueId

        setShowModal(true)
        setSuccess(null)
        setError(null)
    }


    async function deleteTask(id: number) {
        try {
            const url = 'tasks/assign-task/' + id;
            const res = await axiosHandler.delete(url)
            if (res.data.status !== "ok") throw new Error(res.data.message)

            setSuccess('Deleted Successfully');
            // setPageData(val => val.filter(data => data.id !== id));
            await fetchPageDetailsWithPagination(pagination.limit, pagination.page)

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


    const deleteModal = <Modal show={false} id={`model-${currentUniqueId.current}`}>
        <h1 className='text-[2.5rem] text-center'>Confirmation</h1>
        <h2 className='text-[1.5rem] text-center text-error pb-10'>Are you sure, you want to delete this data? </h2>

        <div className='flex w-full justify-evenly'>
            <label htmlFor={`model-${currentUniqueId.current}`} className="w-fit h-fit"><Button className='btn-primary' type='button' onClick={() => setShowModal(false)} >Cancel</Button>
            </label>

            <Button className='btn-error' type='button' onClick={() => deleteTask(currentUniqueId.current)} >Delete</Button>
        </div>
    </Modal>



    const tableData = pageData.map((val: any) => <React.Fragment key={val}> <tr>
        {/* @ts-ignore */}
        <td>{val.assigned.name}</td>
        {/* @ts-ignore */}
        <td>{val?.assignee?.name ? val?.assignee?.name : 'System Generated'}</td> {/* auto, admin name */}
        {/* @ts-ignore */}
        <td>{val.task}</td>
        {/* @ts-ignore */}
        <td>{val.remark}</td>
        {/* @ts-ignore */}
        <td><div className={`badge ${val % 2 == 0 ? `badge-success` : `bg-orange-500 border-orange-500`}  p-4 text-[#fff]`}>{val.status === true ? 'Completed' : 'In progress'} </div></td>
        <td className='flex gap-2 justify-center'>
            <Button
                onClick={() => deleteTaskModel(val.id)}
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
                <label id="label-edit-task-modal" htmlFor="edit-task-modal" className='w-full h-full flex justify-center items-center  cursor-pointer'><FiEdit2 className='text-lg ' />
                </label>
            </Button>
        </td>
    </tr>
    </React.Fragment>)


    const editModelRequest = <Modal id="edit-task-modal" className='max-w-5xl' >
        <h1 className='text-3xl leading-8'>Edit Task</h1>
        <Formik
            initialValues={{
                id: currentEdit.assigned_id,
                //@ts-ignore
                assignee_id: props?.user?.id ? props?.user?.id : null,
                assigned_id: currentEdit.assigned_id,
                task: currentEdit.task,
                remark: currentEdit.remark,
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
                setError(null)
                setSuccess(null)
                setLoading(true)
                try {
                    const response = await axiosHandler.put('/tasks/assign-task', values)
                    if (response.data.status !== 'ok') throw new Error(response.data.message)
                    const data = response.data.data;

                    setPageData((val: any) => [data, ...val]);

                    actions.resetForm();
                    document?.getElementById('label-edit-task-modal')?.click();

                    setSuccess("Task assigned successfully! ")


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
                <Form className="form-control w-full my-auto flex gap-3">
                    <SelectSearchGen
                        name='assigned_id' className='col-span-full'
                        title="Select User"
                        options={userData}
                    />

                    <TextInput
                        placeholder="Add a task"
                        type="text"
                        name="task"
                        className="my-1 text-[1.5rem] "
                    />
                    <TextArea
                        placeholder="Task description"
                        // type="text"
                        name="remark"
                        rows={3}
                        className="my-1 text-[1.5rem] "
                    />


                    <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
                </Form>
            )}
        </Formik>
    </Modal>

    const userData = props.farmUser.map((val: any) => ({ value: val.id, title: `${val.name} ${val.email ?? val.phone}` }))

    return (
        <>
            {error && <MyToast type="error" message={error} />}
            {success && <MyToast type="success" message={success} />}

            {showModal && deleteModal}
            {editModelRequest}

            {/* <div className='w-full h-full mx-5 pr-5'> */}
            <CardLayout className='w-[45rem] h-fit m-auto p-5 rounded'>
                <h1 className='text-3xl leading-8'>Job Card</h1>
                <Formik
                    initialValues={{
                        //@ts-ignore
                        assignee_id: props?.user?.id ? props?.user?.id : null,
                        assigned_id: null,
                        task: "",
                        remark: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, actions) => {
                        setError(null)
                        setSuccess(null)
                        setLoading(true)
                        try {
                            const response = await axiosHandler.post('/tasks/assign-task', values)
                            if (response.data.status !== 'ok') throw new Error(response.data.message)
                            const data = response.data.data;
                            // setPageData(val => val.map(d => d.id === data.id ? expense : d))
                            console.log(data);

                            setPageData((val: any) => [data, ...val]);

                            actions.resetForm()
                            setSuccess("Task assigned successfully! ")


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
                        <Form className="form-control w-full my-auto flex gap-3">
                            <SelectSearchGen
                                name='assigned_id' className='col-span-full'
                                title="Select User"
                                options={userData}
                            />

                            <TextInput
                                placeholder="Add a task"
                                type="text"
                                name="task"
                                className="my-1 text-[1.5rem] "
                            />
                            <TextArea
                                placeholder="Task description"
                                // type="text"
                                name="remark"
                                rows={3}
                                className="my-1 text-[1.5rem] "
                            />


                            <Button type='submit' disabled={loading || Object.keys(props.errors).length > 0} className='btn btn-primary mt-5 w-fit '>{loading ? <Loader /> : 'Submit'}</Button>
                        </Form>
                    )}
                </Formik>
            </CardLayout>





            <div className='flex flex-row justify-between items-center grow my-6 mx-4 '>
                <h1 className='text-3xl font-semibold'>Task list</h1>
            </div>

            {/* <div className='w-full'> */}
            <CardLayout className='w-full h-fit overflow-auto '>
                <table className="table table-compact bg-[--background-white] hover:bg-[--background-white] capitalize relative overflow-x-auto">
                    {/* head */}
                    <thead className='h-15 capitalize sticky '>
                        <tr >
                            {/* total 12 columns */}
                            <td>User Name</td>
                            <td>Assignee</td>
                            <td>Task</td>
                            <td>Remark</td>
                            <td>Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}

                        {tableData}
                    </tbody>
                </table>
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

export default AdminUserForJob;