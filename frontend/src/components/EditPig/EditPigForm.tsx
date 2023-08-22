// import { Batch, Pig_details } from '@prisma/client'
import React, { useState } from 'react'
import { useField, Form, FormikProps, Formik } from "formik";
import { object, string, number, boolean, date } from 'yup';
import StepOne from '../AddPigFormSteps/StepOne';
import StepThree from '../AddPigFormSteps/StepThree';
import StepTwo from '../AddPigFormSteps/StepTwo';


type Props = {
    handleSubmit: (values: any, action: any) => any;
    batchList: any[];
    loading: boolean;
    isEdit?: boolean;
    // initialValues: Pig_details;
    pigUpdateData?: any;
    parentTagNo: any;
}

const EditPigForm = ({ isEdit = false, ...props }: Props) => {

    const [steps, setSteps] = useState<number>(1);



    const validationSchema = object({
        breeding_details: string().required("Breed detail is Required"),
        age: number().min(0, "Age must be greater than 0").positive().required("age is Required"),
        weight: number().min(0, "Weight must be greater than 0").positive().required("Weight is Required"),
        gender: string().required("gender is Required"),
        predictive_pregnancy: boolean().required("Please select a value"),
        batch_no: string().required("batch no is Required"),
        grouping: string().required("grouping is Required"),
        is_ade3h_inj: boolean().required("Please select a value"),
        is_deworming: boolean().required("Please select a value"),
        is_deliveryRoomClean: boolean().required("Please select a value"),
        is_amoxicillin: boolean().required("Please select a value"),
        expected_bitadinespray_date: date().required("Please select a valid date"),
        is_bitadinespray: boolean().required("Please select a value"),
        actual_deliverydate: date().required("Please select a valid date"),
        no_ofPiglet: number().nullable(),
        no_of_male: number().nullable(),
        no_of_female: number().nullable(),
        saw_id: string().nullable(),
        boar_id: string().nullable(),
        first_crossingDate: date().required("Please select a valid date"),
        is_rechockAfterFirstCrossingDate: boolean().required("Please select a value"),
        is_1stAde3h: boolean().required("Please select a value"),
        is_2ndAde3h: boolean().required("Please select a value"),
        // tag_no: string().required("tag id is Required"),
        // unique_id: string().required("unique id is Required"),
        // fathers_tagNo: string().required("father's tag no is Required"),
        // mothers_tagNo: string().required("mother's tag no is Required"),
        // second_crossingDate: date().required("Please select a valid date"),
        // third_heatDate: date().nullable().required("Please select a valid date"),
        // first_heatDate: date().nullable().required("Please select a valid date"),
        // second_heatDate: date().nullable().required("Please select a valid date"),
        // expected_deliveryDate: date().nullable().required("Please select a valid date"),
        // date_of_lic_startedDate: date().nullable().required("Please select a valid date"),
        // expected_deworming_date: date().nullable().required("Please select a valid date"),
        // delivery_room_sentExpectedDate: date().nullable().required("Please select a valid date"),
        // expected_amoxcillin_powderDate: date().nullable().required("Please select a valid date"),
        // expected_1stade3hInjDate: date().nullable().required("Please select a valid date"),
        // expected_2ndade3hInjDate: date().nullable().required("Please select a valid date"),

    });

    // let updatingData: any;
    // if (props.pigUpdateData) {
    //     updatingData = {}
    // }

    const stepCss = 'h-[3.6rem] w-[12.5rem] border border-primary py-[0.5rem] px-[1.8rem] rounded text-center text-[1.5rem] mb-5';
    const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]';
    const cardCss = 'grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 w-full m-auto my-0 gap-x-8 gap-y-5 px-10 py-6';

    return (
        <>
            <div className='w-full flex justify-center items-center gap-10 '>
                <div className={`${stepCss} ${steps === 1 && 'bg-primary text-white'}`} >Step 1</div>
                <div className={`${stepCss} ${steps === 2 && 'bg-primary text-white'}`} >Step 2</div>
                <div className={`${stepCss} ${steps === 3 && 'bg-primary text-white'}`} >Step 3</div>
            </div>
            <Formik
                initialValues={(isEdit && props.pigUpdateData) ? props.pigUpdateData : initialValues}
                // initialValues={initial}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={async (values, actions) => {
                    console.log(values, 'editPigForm 88');
                    const updatedValue = values;
                    await props.handleSubmit(updatedValue, actions)
                    if (isEdit) document.getElementById('edit-pig-details-modal')?.click()
                    setSteps(1)
                }}
            >
                {/* {(props: FormikProps<PigData>) => ( */}
                {(formikProps) => {

                    const { values, errors, touched, setFieldTouched, dirty } = formikProps;
                    console.log(formikProps);
                    // setParentTags({ "mothers_tagNo": formikProps.values.mothers_tagNo, "fathers_tagNo": formikProps.values.fathers_tagNo })
                    return (
                        <Form className="form-control w-full max-w-7xl m-auto text-[1.5rem]">

                            {steps === 1 ?
                                <StepOne onClick={() => setSteps(2)} selectCss={selectCss} cardCss={cardCss} errors={errors} touched={touched} batchList={props.batchList ? props.batchList : []} isEdit={isEdit} parentTagNo={props.parentTagNo} setFieldTouched={setFieldTouched} dirty={dirty} pigUpdateData={props.pigUpdateData ?? {}} currentValue={values} />
                                : steps === 2 ?
                                    <StepThree onClickReturn={() => setSteps(1)} onClickNext={() => setSteps(3)} selectCss={selectCss} cardCss={cardCss} errors={errors} touched={touched} setFieldTouched={setFieldTouched} dirty={dirty} isEdit={isEdit} />
                                    : steps === 3 &&
                                    <StepTwo onClickReturn={() => setSteps(2)} selectCss={selectCss} cardCss={cardCss} errors={errors} touched={touched} loading={props.loading} setFieldTouched={setFieldTouched} />
                            }

                        </Form>
                    )
                }}
            </Formik >
        </>
    )
}

export default EditPigForm;



const initialValues = {
    breeding_details: null,
    tag_no: null,
    age: null,
    weight: null,
    gender: "",
    fathers_tagNo: null,
    mothers_tagNo: null,
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
    tag_no: "sdsdsd",
    third_heatDate: "2023-05-17",
    unique_id: "sdsdsd",
    weight: 2
}