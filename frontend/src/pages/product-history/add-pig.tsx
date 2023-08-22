// import Button from '@/UI/Button/Button';
// import CardLayout from '@/UI/Card/CardLayout';
// import { TextInput } from '@/UI/input/TextInput';

// import { useField, Form, FormikProps, Formik } from "formik";
import React, { useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from "next";
// import StepOne from '@/components/AddPigFormSteps/StepOne';
// import StepTwo from '@/components/AddPigFormSteps/StepTwo';
// import StepThree from '@/components/AddPigFormSteps/StepThree';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { UserType } from '@/types/user';
// import { PigData } from '@/types/pigData';
// import { object, string, number, boolean, date } from 'yup';
import { addPig } from '@/utils/apiRequests';
import MyToast from '@/UI/MyToast';
// import { getAllBatchDB } from '@/utils/prismaCRUD/pigDetailsDB';
// import { Batch } from '@prisma/client';
import EditPigForm from '@/components/EditPig/EditPigForm';
import { systemAxios } from '@/utils/axiosHandler';
import { axiosHeaderAuth } from '@/utils/axiosHeaderAuth';

type Props = {}


const AddPig = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    // const [steps, setSteps] = useState<number>(1)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit(values: any, actions: any) {
        setError(null)
        setSuccess(null)
        setLoading(true)

        // if (values.fathers_tagNo) {
        //     values.fathers_tagNo = values.fathers_tagNo.value
        // }
        // if (values.mothers_tagNo) {
        //     values.mothers_tagNo = values.mothers_tagNo.value
        // }
        if (values.whichPregnancy) {
            values.whichPregnancy = +values.whichPregnancy
        }
        try {
            const pigData = await addPig(values)
            if (pigData) {
                //TODO: add new pig data in the redux's pig data
                setSuccess("Pig data is added successfully!")
            }
            actions.resetForm()
        } catch (error: any) {
            setError(error.message)
            console.log(error.message);

        } finally {
            setLoading(false)
            setTimeout(() => {
                setError(null)
                setSuccess(null)
            }, 20000)
        }
    }


    return (
        <>
            {error && <MyToast type="error" message={error} />}
            {success && <MyToast type="success" message={success} />}

            <EditPigForm
                handleSubmit={handleSubmit}
                loading={loading}
                batchList={props.batchList}
                parentTagNo={props.parentTagNo}
            />
        </>
    )
}

export default AddPig;

type PageProps = {
    user?: UserType
    batchList: any[]
    parentTagNo: any;
}

export async function getServerSideProps(context: any) {

    const pageProps: PageProps = { batchList: [], parentTagNo: {} }
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
    const user = jwtDecode<UserType>(token);
    delete user.exp
    delete user.iat

    pageProps.user = user


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

// const initialValues = {
//     breeding_details: null,
//     unique_id: null,
//     tag_no: null,
//     age: null,
//     weight: null,
//     gender: "",
//     fathers_tagNo: null,
//     mothers_tagNo: null,
//     predictive_pregnancy: "",
//     batch_no: "",
//     sold: "",
//     grouping: null,
//     is_ade3h_inj: "",
//     expected_deworming_date: null,
//     is_deworming: "",
//     delivery_room_sentExpectedDate: null,
//     is_deliveryRoomClean: "",
//     expected_deliveryDate: null,
//     expected_amoxcillin_powderDate: null,
//     is_amoxicillin: "",
//     expected_bitadinespray_date: null,
//     is_bitadinespray: "",
//     actual_deliverydate: null,
//     no_ofPiglet: null,
//     no_of_male: null,
//     no_of_female: null,
//     saw_id: null,
//     boar_id: null,
//     first_heatDate: null,
//     second_heatDate: null,
//     third_heatDate: null,
//     first_crossingDate: null,
//     is_rechockAfterFirstCrossingDate: "",
//     second_crossingDate: null,
//     expected_1stade3hInjDate: null,
//     is_1stAde3h: "",
//     expected_2ndade3hInjDate: null,
//     date_of_lic_startedDate: null,
//     is_2ndAde3h: ""
// }


const initial = {
    actual_deliverydate: "2023-05-21",
    age: 2,
    batch_no: "abcde",
    boar_id: "fgdfgdfg",
    breeding_details: "dsdsd",
    sold: false,
    date_of_lic_startedDate: "2023-05-19",
    delivery_room_sentExpectedDate: "2023-05-13",
    expected_1stade3hInjDate: "2023-05-13",
    expected_2ndade3hInjDate: "2023-05-15",
    expected_amoxcillin_powderDate: "2023-05-05",
    expected_bitadinespray_date: "2023-05-06",
    expected_deliveryDate: "2023-05-18",
    expected_deworming_date: "2023-05-20",
    fathers_tagNo: "dasd",
    first_crossingDate: "2023-05-13",
    first_heatDate: "2023-05-14",
    gender: "female",
    grouping: "sdsdsd",
    is_1stAde3h: false,
    is_2ndAde3h: false,
    is_ade3h_inj: false,
    is_amoxicillin: false,
    is_bitadinespray: false,
    is_deliveryRoomClean: false,
    is_deworming: false,
    is_rechockAfterFirstCrossingDate: false,
    mothers_tagNo: "dsdsd",
    no_ofPiglet: 3,
    no_of_female: 1,
    no_of_male: 2,
    predictive_pregnancy: false,
    saw_id: "dfgdgdfgd",
    second_crossingDate: "2023-05-10",
    second_heatDate: "2023-05-08",
    third_heatDate: "2023-05-17",
    weight: 2
}



// const stepCss = 'h-[3.6rem] w-[12.5rem] border border-primary py-[0.5rem] px-[1.8rem] rounded text-center text-[1.5rem] mb-5';
// const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]';
// const cardCss = 'grid grid-cols-6 w-full m-auto my-0 gap-x-8 gap-y-5 px-10 py-6';



// const formStepOne = <StepOne onClick={() => setSteps(2)} selectCss={selectCss} cardCss={cardCss} />
// const formStepTwo = <StepTwo onClickReturn={() => setSteps(1)} onClickNext={() => setSteps(3)} selectCss={selectCss} cardCss={cardCss} onBlurHandler={onBlurHandler} />
// const formStepThree = <StepThree onClickReturn={() => setSteps(2)} selectCss={selectCss} cardCss={cardCss} onBlurHandler={onBlurHandler} />


// // const validationSchema = object().shape({
// const validationSchema = object({
//     breeding_details: string().required("Breed detail is Required"),
//     unique_id: string().required("unique id is Required"),
//     tag_no: string().required("tag id is Required"),
//     age: number().min(0, "Age must be greater than 0").positive().required("age is Required"),
//     weight: number().min(0, "Weight must be greater than 0").positive().required("Weight is Required"),
//     gender: string().required("gender is Required"),
//     fathers_tagNo: string().required("father's tag no is Required"),
//     mothers_tagNo: string().required("mother's tag no is Required"),
//     predictive_pregnancy: boolean().required("Please select a value"),
//     batch_no: string().required("batch no is Required"),
//     grouping: string().required("grouping is Required"),
//     is_ade3h_inj: boolean().required("Please select a value"),
//     expected_deworming_date: date().nullable().required("Please select a valid date"),
//     is_deworming: boolean().required("Please select a value"),
//     delivery_room_sentExpectedDate: date().nullable().required("Please select a valid date"),
//     is_deliveryRoomClean: boolean().required("Please select a value"),
//     expected_deliveryDate: date().nullable().required("Please select a valid date"),
//     expected_amoxcillin_powderDate: date().nullable().required("Please select a valid date"),
//     is_amoxicillin: boolean().required("Please select a value"),
//     expected_bitadinespray_date: date().required("Please select a valid date"),
//     is_bitadinespray: boolean().required("Please select a value"),
//     actual_deliverydate: date().required("Please select a valid date"),
//     no_ofPiglet: number().nullable(),
//     no_of_male: number().nullable(),
//     no_of_female: number().nullable(),
//     saw_id: string().nullable(),
//     boar_id: string().nullable(),
//     first_heatDate: date().nullable().required("Please select a valid date"),
//     second_heatDate: date().nullable().required("Please select a valid date"),
//     third_heatDate: date().nullable().required("Please select a valid date"),
//     first_crossingDate: date().required("Please select a valid date"),
//     is_rechockAfterFirstCrossingDate: boolean().required("Please select a value"),
//     second_crossingDate: date().required("Please select a valid date"),
//     expected_1stade3hInjDate: date().nullable().required("Please select a valid date"),
//     is_1stAde3h: boolean().required("Please select a value"),
//     expected_2ndade3hInjDate: date().nullable().required("Please select a valid date"),
//     date_of_lic_startedDate: date().nullable().required("Please select a valid date"),
//     is_2ndAde3h: boolean().required("Please select a value"),

// });



// const router = useRouter();










{/* steps */ }
{/* <div className='w-full flex justify-center items-center gap-10 '>
                <div className={`${stepCss} ${steps === 1 && 'bg-primary text-white'}`} >Step 1</div>
                <div className={`${stepCss} ${steps === 2 && 'bg-primary text-white'}`} >Step 2</div>
                <div className={`${stepCss} ${steps === 3 && 'bg-primary text-white'}`} >Step 3</div>
            </div > */}
{/* Form  */ }
{/* <Formik
                initialValues={initialValues}
                // initialValues={initial}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={validationSchema}

                onSubmit={async (values, actions) => {
                    // console.log(values, actions);
                    await handleSubmit(values, actions)
                }}
            > */}
{/* {(props: FormikProps<PigData>) => (
                {({ errors, touched }) => (
                    <Form className="form-control w-full max-w-7xl m-auto text-[1.5rem]">


                        {steps === 1 ?
                            <StepOne onClick={() => setSteps(2)} selectCss={selectCss} cardCss={cardCss} errors={errors} touched={touched} batchList={props.batchList} />
                            : steps === 2 ?
                                <StepTwo onClickReturn={() => setSteps(1)} onClickNext={() => setSteps(3)} selectCss={selectCss} cardCss={cardCss} errors={errors} touched={touched} />
                                : steps === 3 &&
                                <StepThree onClickReturn={() => setSteps(2)} selectCss={selectCss} cardCss={cardCss} errors={errors} touched={touched} loading={loading} />
                        }

                    </Form> */}
{/* )}
            </Formik > */}