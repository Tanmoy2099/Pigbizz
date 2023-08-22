import React, { ReactNode } from "react";
import classes from "./Button.module.css";

type Props = {
  children: string | ReactNode;
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  disabled?: boolean
  // onClick?: () => null | React.SetStateAction<any>;
  onClick?: (value: React.SetStateAction<any> | any) => void
};

const Button = ({ type = 'button', ...props }: Props) => {
  return (
    <>
      <button
        type={type}
        className={`btn text-[1.3rem] ${props?.className} ${classes.button}`}
        disabled={props.disabled}
        onClick={props?.onClick}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
