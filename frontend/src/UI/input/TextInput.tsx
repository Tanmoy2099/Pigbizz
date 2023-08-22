import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  className?: string;
  value?: any;
  disabled?:boolean;
};

export const TextInput: React.FC<InputFieldProps> = ({
  label,
  errorMessage,
  containerClassName,
  labelClassName,
  className,
  ...props
}) => {
  const [field, meta] = useField(props);

  const errorLabel = (
    // <label className="label">
    <span className=" text-[1.2rem] text-error">{meta.error}</span>
    // </label>
  );
  return (
    // <React.Fragment>
    <div className={className}>
      <input
        {...field}
        {...props}
        className={`input input-bordered w-full h-[4rem] p-[1rem] text-[1.4rem] ${meta.touched && meta.error ? "error" : ""
          }`}
      />
      {meta.error && meta.touched && errorLabel}
    </div>
    // </React.Fragment>
  );
};
