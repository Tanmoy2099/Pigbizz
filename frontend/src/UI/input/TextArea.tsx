import { useField } from "formik";
import React, { TextareaHTMLAttributes } from "react";

type InputFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    name: string;
    rows: number;
    label?: string;
    errorMessage?: string;
    containerClassName?: string;
    labelClassName?: string;
    className?: string;
};

export const TextArea: React.FC<InputFieldProps> = ({
    label,
    errorMessage,
    containerClassName,
    labelClassName,
    className,
    ...props
}) => {
    const [field, meta] = useField(props);

    const errorLabel = (
        <label className="label">
            <span className="label-text-alt text-warning">{meta.error}</span>
        </label>
    );
    return (
        <React.Fragment>
            <textarea
                {...field}
                {...props}
                className={`textarea textarea-bordered w-full p-[1rem] mb-[2rem] ${className} ${meta.touched && meta.error ? "error" : ""
                    }`}
            />
            {meta.error && meta.touched && errorLabel}
        </React.Fragment>
    );
};
