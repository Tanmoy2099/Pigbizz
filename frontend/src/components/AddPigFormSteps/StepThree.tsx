import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import { TextInput } from '@/UI/input/TextInput';
import Select from '@/UI/select/Select';
import { PigData } from '@/types/pigData';
import { onBlurHandler } from '@/utils/UIHelper';
import { FormikErrors, FormikTouched } from 'formik';
import React from 'react'

type Props = {
    onClickReturn: (value: React.SetStateAction<number>) => void;
    onClickNext: (value: React.SetStateAction<number>) => void;
    cardCss: string;
    selectCss: string;
    errors?: FormikErrors<PigData>;
    touched?: FormikTouched<PigData>;
    setFieldTouched: Function;
    dirty: Boolean;
    isEdit?: Boolean;
}

const stepTwo = (props: Props) => {

    const valuesToCheck = {
        // "saw_id": true,
        // "boar_id": true,
        "is_1stAde3h": true,
        "is_2ndAde3h": true,
        "is_rechockAfterFirstCrossingDate": true,

    }

    // weight: number().min(0, "Weight must be greater than 0").positive().required("Weight is Required"),
    // is_ade3h_inj: boolean().required("Please select a value"),
    // is_deworming: boolean().required("Please select a value"),
    // delivery_room_sentExpectedDate: date().nullable().required("Please select a valid date"),
    // is_deliveryRoomClean: boolean().required("Please select a value"),
    // is_amoxicillin: boolean().required("Please select a value"),
    // expected_bitadinespray_date: date().required("Please select a valid date"),
    // is_bitadinespray: boolean().required("Please select a value"),
    // actual_deliverydate: date().required("Please select a valid date"),

    // first_crossingDate: date().required("Please select a valid date"),
    // second_crossingDate: date().required("Please select a valid date"),


    return (
        <>

            <CardLayout className={props.cardCss} >
                <h1 className='col-span-full text-[2.4rem] pl-5'>Medicine details</h1>
                {/* Saw ID */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Saw ID" type="text" name='saw_id' />
                {/* Boar ID */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Boar ID" type="text" name='boar_id' />
                {/* 1st heat date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="1st heat date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='first_heatDate' />
                {/* 2nd heat date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="2nd heat date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='second_heatDate' />
                {/* 3rd heat date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="3rd heat date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='third_heatDate' />
                {/* 1st crossing date & repeat crossing date after 12 hour */}
                <TextInput className='col-span-full md:col-span-2 lg:col-span-full' placeholder="1st crossing date & repeat crossing date after 12 hour" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='first_crossingDate' />
                {/* Rechock of 1st crossing after 21 days Y/N */}
                {/* <select className={`${props.selectCss} col-span-4 text-lg`}>
    <option disabled selected>Rechock of 1st crossing after 21 days Y/N</option>
    <option value={true}>Yes</option>
    <option value={false}>No</option>
</select> */}
                <Select name='is_rechockAfterFirstCrossingDate' className='col-span-4' title='Rechock of 1st crossing after 21 days Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

                {/* 2nd crossing date */}
                <TextInput className='col-span-2' placeholder="2nd crossing date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='second_crossingDate' />
                {/* Expected 1st ADE3H inj. date after 42 days  */}
                <TextInput className='col-span-4 md:col-span-2 lg:col-span-4' placeholder="Expected 1st ADE3H inj. date after 42 days " type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_1stade3hInjDate' />
                {/* 1st ADE3H Y/N */}
                {/* <select className={`${props.selectCss} col-span-2 text-lg`}>
    <option disabled selected>1st ADE3H Y/N</option>
    <option>Yes</option>
    <option>No</option>
</select> */}
                <Select name='is_1stAde3h' className='col-span-2' title='1st ADE3H Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

                {/* Expected 2nd ADE3H inj. date after 100 days   */}
                <TextInput className='md:col-span-2 col-span-full lg:col-span-full' placeholder="Expected 2nd ADE3H inj. date after 100 days " type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_2ndade3hInjDate' />
                {/* Date of liquid ,iron & calcium started from 100 days */}
                <TextInput className='col-span-4 md:col-span-2 lg:col-span-4' placeholder="Date of liquid ,iron & calcium started from 100 days" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='date_of_lic_startedDate' />
                {/* (I), (Fe), (Ca) started Y/N */}
                {/* <select className={`${props.selectCss} col-span-2 text-lg`}>
    <option disabled selected>(I), (Fe), (Ca) started Y/N</option>
    <option>Yes</option>
    <option>No</option>
</select> */}

                <Select name='is_2ndAde3h' className='col-span-2' title='(I), (Fe), (Ca) started Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

            </CardLayout >
            <div className='mt-4 w-full flex justify-end gap-5'>
                <Button type='button' onClick={props.onClickReturn}>Back</Button>
                <Button type='button' onClick={(e) => {
                    if (props.isEdit) {
                        props.onClickNext(e)
                        return
                    }

                    const keys = Object.keys(valuesToCheck)
                    keys.forEach((val: any) => props.setFieldTouched(val, true))
                    for (const key of keys) {
                        //@ts-ignore
                        if (props.errors[key]) return
                    }
                    props.onClickNext(e)
                }}>Next</Button>
            </div>



        </>
    )
}

export default stepTwo;
