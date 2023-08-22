


import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import Loader from '@/UI/Loader/Loader';
import { TextInput } from '@/UI/input/TextInput';
import Select from '@/UI/select/Select';
import { PigData } from '@/types/pigData';
import { onBlurHandler } from '@/utils/UIHelper';
import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';

type Props = {
    onClick?: (value: React.SetStateAction<number>) => void;
    onClickReturn: (value: React.SetStateAction<number>) => void;
    cardCss: string;
    selectCss: string;
    errors?: FormikErrors<PigData>;
    touched?: FormikTouched<PigData>;
    loading: boolean;
    setFieldTouched: Function;
}


const StepThree = (props: Props) => {

    let isDisabled: boolean = true

    if (props?.errors) {
        isDisabled = Object.keys(props?.errors).length > 0
    }

    // <CardLayout className={props.cardCss}>
    //     <h1 className='col-span-full text-[2.4rem] pl-5'>Medicine details</h1>
    //     {/* Saw ID */}
    //     <TextInput className='col-span-3' placeholder="Saw ID" type="text" name='saw_id' />
    //     {/* Boar ID */}
    //     <TextInput className='col-span-3' placeholder="Boar ID" type="text" name='boar_id' />
    //     {/* 1st heat date */}
    //     <TextInput className='col-span-2' placeholder="1st heat date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='first_heatDate' />
    //     {/* 2nd heat date */}
    //     <TextInput className='col-span-2' placeholder="2nd heat date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='second_heatDate' />
    //     {/* 3rd heat date */}
    //     <TextInput className='col-span-2' placeholder="3rd heat date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='third_heatDate' />
    //     {/* 1st crossing date & repeat crossing date after 12 hour */}
    //     <TextInput className='col-span-full' placeholder="1st crossing date & repeat crossing date after 12 hour" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='first_crossingDate' />
    //     {/* Rechock of 1st crossing after 21 days Y/N */}
    //     {/* <select className={`${props.selectCss} col-span-4 text-lg`}>
    //         <option disabled selected>Rechock of 1st crossing after 21 days Y/N</option>
    //         <option value={true}>Yes</option>
    //         <option value={false}>No</option>
    //     </select> */}
    //     <Select name='is_rechockAfterFirstCrossingDate' className='col-span-4' title='Rechock of 1st crossing after 21 days Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

    //     {/* 2nd crossing date */}
    //     <TextInput className='col-span-2' placeholder="2nd crossing date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='second_crossingDate' />
    //     {/* Expected 1st ADE3H inj. date after 42 days  */}
    //     <TextInput className='col-span-4' placeholder="Expected 1st ADE3H inj. date after 42 days " type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_1stade3hInjDate' />
    //     {/* 1st ADE3H Y/N */}
    //     {/* <select className={`${props.selectCss} col-span-2 text-lg`}>
    //         <option disabled selected>1st ADE3H Y/N</option>
    //         <option>Yes</option>
    //         <option>No</option>
    //     </select> */}
    //     <Select name='is_1stAde3h' className='col-span-2' title='1st ADE3H Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

    //     {/* Expected 2nd ADE3H inj. date after 100 days   */}
    //     <TextInput className='col-span-full' placeholder="Expected 2nd ADE3H inj. date after 100 days " type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_2ndade3hInjDate' />
    //     {/* Date of liquid ,iron & calcium started from 100 days */}
    //     <TextInput className='col-span-4' placeholder="Date of liquid ,iron & calcium started from 100 days" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='date_of_lic_startedDate' />
    //     {/* (I), (Fe), (Ca) started Y/N */}
    //     {/* <select className={`${props.selectCss} col-span-2 text-lg`}>
    //         <option disabled selected>(I), (Fe), (Ca) started Y/N</option>
    //         <option>Yes</option>
    //         <option>No</option>
    //     </select> */}

    //     <Select name='is_2ndAde3h' className='col-span-2' title='(I), (Fe), (Ca) started Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

    // </CardLayout>

    return (
        <>


            <CardLayout className={props.cardCss}>
                <h1 className='col-span-full text-[2.4rem] pl-5'>Medicine details</h1>
                {/* 2nd ADE3H inj */}
                {/* <select className={`${props.selectCss} col-span-3`}>
                    <option disabled selected>2nd ADE3H inj. Y/N</option>
                    <option>Yes</option>
                    <option>No</option>
                </select> */}

                <Select name='is_ade3h_inj' className='col-span-3 md:col-span-2 lg:col-span-3' title='2nd ADE3H inj. Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

                {/* Expected deworming date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Expected deworming date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_deworming_date' />
                {/* Deworming Y/N */}
                {/* <select className={`${props.selectCss} col-span-3`}>
                    <option disabled selected>Deworming Y/N</option>
                    <option>Yes</option>
                    <option>No</option>
                </select> */}

                <Select name='is_deworming' className='col-span-3 md:col-span-2 lg:col-span-3' title='Deworming Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

                {/* Send to delivery room expected date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Send to delivery room expected date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='delivery_room_sentExpectedDate' />
                {/*Delivery room clean Y/N */}
                {/* <select className={`${props.selectCss} col-span-3`}>
                    <option disabled selected>Delivery room clean Y/N</option>
                    <option>Yes</option>
                    <option>No</option>
                </select> */}


                <Select name='is_deliveryRoomClean' className='col-span-3 md:col-span-2 lg:col-span-3' title='Delivery room clean Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />

                {/* Expected delivery date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Expected delivery date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_deliveryDate' />
                {/* Expected  amoxicillin powder date */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Expected amoxicillin powder date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_amoxcillin_powderDate' />
                {/*Amoxicillin Y/N */}
                {/* <select className={`${props.selectCss} col-span-full `}>
                    <option disabled selected>Amoxicillin Y/N</option>
                    <option>Yes</option>
                    <option>No</option>
                </select> */}
                <Select name='is_amoxicillin' className='col-span-3 md:col-span-2 lg:col-span-3' title='Amoxicillin Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />


                {/* Expected betadine spray date  */}
                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Expected betadine spray date " type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='expected_bitadinespray_date' />
                {/*Betadine spray Y/N */}
                {/* <select className={`${props.selectCss} col-span-3 text-lg`}>
                    <option disabled selected>Betadine spray Y/N</option>
                    <option>Yes</option>
                    <option>No</option>
                </select> */}
                <Select name='is_bitadinespray' className='col-span-3 md:col-span-2 lg:col-span-3' title='Betadine spray Y/N' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />
                {/* Actual delivery date */}
                <TextInput className='col-span-full' placeholder="Actual delivery date" type="text" onBlur={onBlurHandler} onFocus={e => (e.target.type = 'date')} name='actual_deliverydate' />
                <TextInput className='col-span-2' placeholder="No of piglet" type="number" name='no_ofPiglet' />
                <TextInput className='col-span-2' placeholder="No of Male" type="number" name='no_of_male' />
                <TextInput className='col-span-2' placeholder="No of Female" type="number" name='no_of_female' />

            </CardLayout>
            <div className='mt-4 w-full flex justify-end  gap-5'>
                <Button type='button' onClick={props.onClickReturn}>Back</Button>
                <Button type='submit'
                    // disabled={!props.loading} 
                    className={`btn-primary ${isDisabled ? "btn-[#a779f7] btn-disabled cursor-not-allowed" : ""} `}>{props.loading ? <Loader /> : 'Submit'}</Button>
            </div>
        </>
    )
}

export default StepThree;
