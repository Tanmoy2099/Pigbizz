import React, { useEffect, useState } from "react";
import SignInUpBackground from "@/UI/signInUpBackground/SignInUpBackground";
import { TextInput } from "@/UI/input/TextInput";
// import { Form, FormikProps } from "formik";
import { useField, Form, FormikProps, Formik } from "formik";
import Button from "@/UI/Button/Button";
import Link from "next/link";
import RememberMe from "@/UI/input/RememberMe";

import { axiosHandler } from "@/utils/axiosHandler";
import MyToast from "@/UI/MyToast";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from "jwt-decode";
import Loader from "@/UI/Loader/Loader";
import { setCookie } from "@/utils/cookie";
import { jwtUser } from "@/types/auth";

interface Values {
  email: string;
  phone: string;
  password: string;
}

const emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function login(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [rememberedData, setRememberedData] = useState({ email: "", password: "", phone: "" });

  const title = (
    <p className="pb-2 pt-1">
      Please sign-in to your account and start the adventure
    </p>
  );
  console.log(props.user);

  useEffect(() => {
    if (props.user) {
      router.push('/')
    }
  }, [props.user])



  return (
    <>
      {error && <MyToast type="error" message={error} />}
      {success && <MyToast type="success" message={success} />}
      <div>
        <div className="flex h-[100vh] w-[100vw] justify-center items-center">
          <SignInUpBackground
            className="h-[45rem] w-[38rem] bg-[#fff] bg-opacity-70"
            title={title}
          >
            {/* <TextInput placeholder="Email" type="text" /> */}

            <Formik
              initialValues={{
                email: rememberedData.email,
                phone: rememberedData.phone,
                password: rememberedData.password,
              }}
              enableReinitialize
              onSubmit={async (values, actions) => {

                setError(null)
                setSuccess(null)
                setLoading(true)

                if (!emailValidationRegex.test(values.email)) {
                  values.phone = values.email
                  values.email = ""
                }

                try {
                  const response = await axiosHandler.post('/auth/login', values)
                  if (response.data.status !== 'ok') throw new Error(response.data.message)
                  const user = response.data.token
                  setCookie(response.data.token);

                  if (user) {
                    setSuccess("You are Logged in successfully !")
                    actions.resetForm()
                    router.push('/')
                  }


                } catch (error: any) {
                  const msg = error.response?.data.message ? error.response?.data.message : error.message
                  console.log(msg)
                  setError(msg)
                } finally {
                  setLoading(false)
                }
              }}
            >
              {(props: FormikProps<Values>) => (
                <Form className="form-control w-full my-auto">
                  <TextInput
                    placeholder="Email or Phone"
                    type="text"
                    name="email"
                    className="my-1 text-[1.5rem] bg-[#F5F5F5] mb-[2rem]"
                  />
                  <TextInput
                    placeholder="Password"
                    type="password"
                    name="password"
                    className="my-1 text-[1.5rem] bg-[#F5F5F5] mb-[2rem]"
                  />
                  <div className="flex mb-8">
                    <div className="w-[50%]">
                      <RememberMe data={{ email: props?.values.email, password: props?.values.password, phone: props?.values.phone }} setData={setRememberedData} />
                    </div>
                    <div className="w-[50%] flex justify-end">
                      <Link
                        href="/forgot-password"
                        className="self-start link link-primary text-[1.2rem]"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !!success}
                    className="btn-[#000] my-auto text-[1.2rem] h-[4rem]"
                  >
                    {(loading) ? <Loader /> : 'LOG IN'}
                  </Button>
                </Form>
              )}
            </Formik>
          </SignInUpBackground>
        </div>
      </div>
    </>
  );
};

// login.notLoginPage = true

export default login;

type PageProps = {
  user?: jwtUser
}

export async function getServerSideProps(context: any) {

  const pageProps: PageProps = {}
  const { token } = parseCookies(context);

  console.log(token, context.req.cookies);


  if (token) {
    // redirectUser(context, '/');
    pageProps.user = jwtDecode<jwtUser>(token);
    console.log(pageProps.user);

    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: pageProps,
    }
  };

  return {
    props: pageProps, // will be passed to the page component as props
  };
}

