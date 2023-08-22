

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

const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]';

const SelectSearch = (props: Props) => {
    const { name, isEdit, ...otherProps } = props;
    const { values, setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const allOptions = props.options?.map((value) => ({
        value: value.value,
        label: value.title,
    }));

    // const selectedOption = allOptions.find((option) => option.value === field.value);
    // const [selectedValue, setSelectedValue] = useState<{ label: string, value: any }>(isEdit ? (selectedOption?.value ? selectedOption : { label: field.value, value: field.value }) : { label: field.value, value: field.value })

    const [selectedValue, setSelectedValue] = useState({ label: field.value, value: field.value });


    //@ts-ignore
    // const selectedOption = allOptions.find((option) => option.value === values[name]);
    useEffect(() => {
        // if (field.value !== null || field.value !== undefined) {
        setSelectedValue((val: any) => ({ label: field.value, value: field.value }))
        // }
    }, [field.value])


    return (
        <>
            <Select
                {...field}
                {...otherProps}
                options={allOptions}
                isSearchable // This enables the search functionality
                placeholder={props.title}
                // value={isEdit ? selectedOption : ""}
                value={selectedValue.value ? selectedValue : null}
                // value={selectedValue}
                onChange={(selectedOption) => {
                    // if (selectedOption?.value) {
                    setFieldValue(name, selectedOption?.value); // Update Formik field value
                    // }
                }}
            />
            {meta.touched && meta.error && (
                <span className="text-[1.2rem] text-error">{meta.error}</span>
            )}
        </>
    );
};

export default SelectSearch;











// import { useField } from 'formik';
// import React from 'react';
// import Select from 'react-select';

// type Option = {
//     value: any;
//     title: string;
//     selected?: boolean;
// };

// type Props = {
//     name: string;
//     title: string;
//     options: Option[];
//     className: string;
//     isEdit?: boolean;
// };

// const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]';

// const SelectSearch = (props: Props) => {
//     const { name, isEdit, ...otherProps } = props;
//     const [field, meta] = useField(name);

//     const allOptions = props.options?.map((value) => ({
//         value: value.value,
//         label: value.title,
//     }));

//     const selectedOption = allOptions.find((option) => option.value === field.value);
//     console.log(field);

//     return (
//         <>
//             <Select
//                 {...field}
//                 {...otherProps}
//                 options={allOptions}
//                 isSearchable // This enables the search functionality
//                 placeholder={props.title}
//                 value={selectedOption}
//                 onChange={(selectedOption) => {
//                     console.log(selectedOption);

//                     field.onChange(selectedOption?.value || ''); // Update Formik field value
//                 }}
//             />
//             {meta.touched && meta.error && (
//                 <span className="text-[1.2rem] text-error">{meta.error}</span>
//             )}
//         </>
//     );
// };

// export default SelectSearch;





















// import { useField } from 'formik';
// import React from 'react';
// import Select from 'react-select';

// type Option = {
//     value: any;
//     title: string;
//     selected?: boolean;
// };

// type Props = {
//     name: string;
//     title: string;
//     options: Option[];
//     className: string;
//     isEdit?: Boolean;
// };

// const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]';

// const SelectSearch = (props: Props) => {
//     const { name, isEdit, ...otherProps } = props;
//     const [field, meta, helpers] = useField(name);

//     const allOptions = props.options?.map((value, index) => ({
//         value: value.value,
//         label: value.title,
//     }));

//     const handleChange = (selectedOption: any) => {
//         helpers.setValue(selectedOption.value); // Update Formik field value
//     };

//     let defaultValue = null;

//     if (isEdit) {
//         // If it's an edit form, set the default value to the current field value
//         defaultValue = allOptions.find((option) => option.value === field.value);
//     }

//     return (
//         <>
//             <Select
//                 {...field}
//                 {...otherProps}
//                 options={allOptions}
//                 isSearchable // This enables the search functionality
//                 placeholder={props.title}
//                 onChange={handleChange}
//                 value={defaultValue}
//             />
//             {meta.touched && meta.error && (
//                 <span className="text-[1.2rem] text-error">{meta.error}</span>
//             )}
//         </>
//     );
// };

// export default SelectSearch;



// import { useField } from 'formik';
// import React, { useState } from 'react';
// import Select from 'react-select';

// type Option = {
//     value: any;
//     title: string;
//     selected?: boolean;
// };

// type Props = {
//     name: string;
//     title: string;
//     options: Option[];
//     className: string;
//     isEdit?: Boolean;
//     value?: any;
// };

// const selectCss = 'select select-bordered h-[4rem] text-[1.4rem]';

// const SelectSearch = (props: Props) => {
//     const [field, meta, helpers] = useField(props);

//     const [defaultValue, setDefaultValue] = useState({ value: field.value, label: field.value })

//     const errorLabel = meta.error && meta.touched && (
//         <span className="text-[1.2rem] text-error">{meta.error}</span>
//     );

//     const allOptions = props.options?.map((value, index) => ({
//         value: value.value,
//         label: value.title,
//         // selected: value.selected ? true : false,
//         // selected: props.isEdit ? (value.value === field.value ? true : false) : (value.selected ? true : false),
//         // selected: false,
//     }));

//     // const allOptions = props.options?.map((value, index) => value.value);

//     // console.log(allOptions, "allOptions");


//     const handleChange = (selectedOption: any) => {
//         setDefaultValue(selectedOption);
//     };

//     // let prevValue: any = null
//     // if (props.isEdit) {
//     //     prevValue = field.value
//     // }

//     return (
//         // <div className={`flex flex-col ${props.className}`}>
//         <>
//             <Select
//                 {...field}
//                 {...props}
//                 options={allOptions}
//                 // className={`${selectCss} ${props.className} w-full`}
//                 isSearchable // This enables the search functionality
//                 placeholder={props.title}
//                 onChange={handleChange}
//                 value={defaultValue}
//             />
//             {errorLabel}
//         </>
//         // </div>
//     );
// };

// export default SelectSearch;






