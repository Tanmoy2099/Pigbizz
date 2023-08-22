import React, { ReactNode } from "react";
import classes from "./FormLayout.module.css";

type Props = {
  children: ReactNode;
  title?: ReactNode;
  className?: string;
};

const FormLayout = ({ children, title, className }: Props) => {
  return (
    <>
      <div
        // className={`card backdrop-blur-sm hover:backdrop-blur-sm w-[100%] h-[100%] items-center ${className}`}
        className={`card backdrop-blur-[2px] hover:backdrop-blur-[2px] w-[100%] h-[100%] items-center ${className}`}
      >
        <div className="card-title-80 pt-2 m-auto mt-[4.5rem] text-primary text-[2rem]">
          {process.env.appname || 'PigBizz'}
        </div>
        <div className="card-title-80 m-auto mt-[2rem] mb-[1rem] text-[2.5rem]">
          Welcome to {process.env.appname || 'PigBizz'}!
        </div>
        {title}
        <div className="card-body w-[75%] px-0 mx-0">{children}</div>
      </div>
    </>
  );
};

export default FormLayout;
