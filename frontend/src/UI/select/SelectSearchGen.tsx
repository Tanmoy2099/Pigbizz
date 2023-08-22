

// SelectSearch.tsx
import { useField, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

type Option = {
    value: any;
    title: string;
    selected?: boolean;
};

type Props = {
    name: string;
    title: string;
    options: Option[];
    className: string;
    isEdit?: boolean;
};


const SelectSearchGen = (props: Props) => {
    const { name, isEdit, ...otherProps } = props;
    const { values, setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    console.log(values);

    const allOptions = props.options?.map((value) => ({
        value: value.value,
        label: value.title,
    }));

    const [selectedValue, setSelectedValue] = useState({ label: "", value: null });

    useEffect(() => {
        const currentValue = allOptions.filter((val: any) => val.value === field.value)[0];
        setSelectedValue({ ...currentValue });
    }, [field.value])


    return (
        <>
            <Select
                {...field}
                {...otherProps}
                options={allOptions}
                isSearchable // This enables the search functionality
                placeholder={props.title}
                value={selectedValue.value ? selectedValue : null}
                onChange={(selectedOption) => setFieldValue(name, selectedOption?.value)} // Update Formik field value
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: "1.6rem"
                    }),
                }}
            />

            {meta.touched && meta.error && (<span className="text-[1.2rem] text-error">{meta.error}</span>)}
        </>
    );
};

export default SelectSearchGen;
