import React, { ReactNode } from "react";
import classes from "./SignInUpBackground.module.css";
import FormLayout from "../formLayout/FormLayout";

type Props = {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
};

const SignInUpBackground = (props: Props) => {


  return (
    <>
      <img
        className={classes.background_image}
        src="/images/farm_house.svg"
        alt="farm house"
      />
      <img
        className={classes.background_pig_image}
        src="/images/login_pig.svg"
        alt="pig"
      />
      <FormLayout title={props.title} className={props.className}>
        {props.children}
      </FormLayout>
    </>
  );
};

export default SignInUpBackground;
