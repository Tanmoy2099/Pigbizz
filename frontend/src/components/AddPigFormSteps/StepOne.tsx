import Button from '@/UI/Button/Button';
import CardLayout from '@/UI/Card/CardLayout';
import { TextInput } from '@/UI/input/TextInput';
import Select from '@/UI/select/Select';
import SelectSearch from '@/UI/select/SelectSearch';
import { PigData } from '@/types/pigData';
// import { Batch } from '@prisma/client';
import { FormikErrors, FormikTouched } from 'formik';
import React from 'react'

type Props = {
    onClick: (value: React.SetStateAction<number>) => void;
    cardCss: string;
    selectCss: string;
    errors?: FormikErrors<PigData>;
    touched?: FormikTouched<PigData>;
    batchList: any[];
    isEdit?: boolean;
    parentTagNo: any;
    setFieldTouched: Function;
    dirty: Boolean;
    pigUpdateData?: any;
    currentValue?: any;
}

const StepOne = (props: Props) => {

    const isEdit = props?.isEdit ? props.isEdit : false
    const batchValues = props.batchList.map(val => ({ value: val.batch, title: val.batch }))

    let maleTag = [], femaleTag = [];

    console.log(props.pigUpdateData);


    let fathersTagNo = isEdit ? props.parentTagNo?.male.filter((val: string) => val?.toLowerCase() !== props.pigUpdateData?.tag_no?.toLowerCase()) : props.parentTagNo?.male
    let mothersTagNo = isEdit ? props.parentTagNo?.female.filter((val: string) => val?.toLowerCase() !== props.pigUpdateData?.tag_no?.toLowerCase()) : props.parentTagNo?.male

    if (fathersTagNo.length > 0) {
        maleTag = props.parentTagNo.male.map((val: any) => ({ value: val, title: val }))
    }

    if (mothersTagNo.length > 0) {
        femaleTag = props.parentTagNo.female.map((val: any) => ({ value: val, title: val }))
    }

    const valuesToCheck = {
        "age": true,
        "weight": true,
        "batch_no": true,
        "breeding_details": true,
        "gender": true,
        "grouping": true,
        "predictive_pregnancy": true,
    }

    return (
        <>
            <CardLayout className={props.cardCss}>
                <h1 className='col-span-full text-[2.2rem] pl-5'>Basic details</h1>
                {/* <TextInput className='col-span-full' placeholder="Enter breeding details" type="text" name='breeding_details' /> */}

                <Select name='breeding_details' className='col-span-3 md:col-span-2' title='Enter breeding details' options={[{ value: 'breeder', title: 'Breeder' }, { value: 'guild', title: 'Guild' }]} />

                {/* <TextInput className='col-span-3' placeholder="Unique ID" type="text" name='unique_id' disabled={isEdit} /> */}
                {/* <TextInput className='col-span-3' placeholder="Enter tag no" type="text" name='tag_no' disabled={isEdit} /> */}
                <TextInput className='col-span-1 md:col-span-2' placeholder="Age" type="number" name='age' />
                <TextInput className='col-span-1 md:col-span-2' placeholder="Weight" type="number" name='weight' />
                {/* <select name='Gender' className={`${props.selectCss} col-span-2`}>
                    <option disabled selected>Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                </select> */}

                {/* <TextInput className='col-span-3' placeholder="Father's tag No" type="text" name='tag_no' /> */}

                <SelectSearch name='fathers_tagNo' className='col-span-2 lg:col-span-3' title="Father's tag No" options={maleTag} isEdit={isEdit} />

                <SelectSearch name='mothers_tagNo' className='col-span-2 lg:col-span-3' title="Mother's tag No" options={femaleTag} isEdit={isEdit} />


                <Select name='whichPregnancy' className='col-span-3 md:col-span-2 lg:col-span-3' title="Which Pregnancy?" options={[
                    { value: 1, title: '1st' },
                    { value: 2, title: '2nd' },
                    { value: 3, title: '3rd' },
                    { value: 4, title: '4th' },
                    { value: 5, title: '5th' },
                ]} />

                <Select name='gender' className='col-span-3 md:col-span-2 lg:col-span-3' title='Gender' options={[{ value: 'male', title: 'Male' }, { value: 'female', title: 'Female' }]} />

                {/* <TextInput className='col-span-3' placeholder="Mother's tag No" type="text" name='mothers_tagNo' /> */}

                {/* <select className={`${props.selectCss} col-span-3`}>
                    <option disabled selected>Predictive pregnancy</option>
                    <option>yes</option>
                    <option>no</option>
                </select> */}
                <Select name='predictive_pregnancy' className='col-span-3 md:col-span-2 lg:col-span-3' title='Predictive pregnancy' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />
                {/* <select className={`${props.selectCss} col-span-3`}>
                    <option disabled selected>Select batch no</option>
                    <option>Homer</option>
                    <option>Marge</option>
                </select> */}
                <Select name='batch_no' className='col-span-3 md:col-span-2 lg:col-span-3' title='Select batch no' options={batchValues} />

                <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Grouping" type="text" name='grouping' />

                <Select name='sold' className='col-span-3 md:col-span-2 lg:col-span-3' title='Pig Sold' options={[{ value: true, title: 'Yes' }, { value: false, title: 'No' }]} />
                {isEdit && props.currentValue.sold &&
                    <TextInput className='col-span-3 md:col-span-2 lg:col-span-3' placeholder="Price" type="number" name='price' />}
            </CardLayout>
            <div className='mt-4 w-full flex justify-end'>
                <Button type='button' onClick={(e) => {
                    if (props.isEdit) {
                        props.onClick(e)
                        return
                    }
                    const keys = Object.keys(valuesToCheck)
                    keys.forEach((val: any) => props.setFieldTouched(val, true))
                    for (const key of keys) {
                        //@ts-ignore
                        if (props.errors[key]) return
                    }
                    if (!props.dirty) return
                    props.onClick(e)
                }}>Next</Button>
            </div>
        </>
    )
}

export default StepOne;