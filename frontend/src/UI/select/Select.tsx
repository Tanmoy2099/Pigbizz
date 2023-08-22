import { useField } from 'formik';
import React from 'react'

type Props = {
    name: string;
    title: string;
    options: { value: any, selected?: boolean, title: string }[];
    className: string;
    value?: any;
}
const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]'
const Select = (props: Props) => {
    const [field, meta] = useField(props);

    const errorLabel = (
        // <label className="label">
        <span className=" text-[1.2rem] text-error">{meta.error}</span>
        // </label>
    );

    const allOptions = props.options.map((value, index) => <option key={index} selected={value.selected ? true : false} value={value.value}>{value.title}</option>)

    // const allOptions = props.options.map((value, index) => <option key={index} selected={false} value={value.value}>{value.title}</option>)
    return (
        <div className={`flex flex-col ${props.className}`}>
            <select {...field}
                {...props}
                // name={props.name}
                // size={2}
                // onFocus={e => e.target.size = 5}
                // onBlur={e => e.target.size = 1}
                className={`${selectCss} `}>
                <option className='text-opacity-50' value="" selected disabled >{props.title}</option>
                {allOptions}
            </select>
            {meta.error && meta.touched && errorLabel}
        </div>
    )
}

export default Select;