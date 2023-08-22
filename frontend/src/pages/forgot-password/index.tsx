import React, { useState } from "react";
import SignInUpBackground from "@/UI/signInUpBackground/SignInUpBackground";
import { TextInput } from "@/UI/input/TextInput";
// import { Form, FormikProps } from "formik";
import { useField, Form, FormikProps, Formik } from "formik";
import Checkbox from "@/UI/input/RememberMe";
import Button from "@/UI/Button/Button";
import Link from "next/link";
import RememberMe from "@/UI/input/RememberMe";

import { axiosHandler } from "@/utils/axiosHandler";
import MyToast from "@/UI/MyToast";
import { redirectUser } from "@/utils/redirectUser";
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
}

const emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function forgotPassword(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)

    let initialData = { email: "", phone: "" }
    // const storedRememberMe = localStorage?.getItem('rememberMe');
    // if (storedRememberMe) {
    //     const savedData = JSON.parse(storedRememberMe);
    //     initialData.email = savedData.email
    //     initialData.phone = savedData.phone
    // }
    const [rememberedData, setRememberedData] = useState(initialData);

    const title = (
        <p className="pb-2 pt-1">
            To reset your password please submit your details
        </p>
    );


    return (
        <>
            {error && <MyToast type="error" message={error} />}
            {success && <MyToast type="success" message={success} />}
            <div>
                <div className="flex h-[100vh] w-[100vw] justify-center items-center">
                    <SignInUpBackground
                        className="h-[30rem] w-[38rem] bg-[#fff] bg-opacity-70"
                        title={title}
                    >
                        {/* <TextInput placeholder="Email" type="text" /> */}

                        <Formik
                            initialValues={{
                                email: rememberedData.email,
                                phone: rememberedData.phone,
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
                                    const response = await axiosHandler.post('/auth/forgot-password', values)
                                    if (response.data.status !== 'ok') throw new Error(response.data.message)
                                    const msg = response.data.data

                                    setSuccess(msg)
                                    actions.resetForm()
                                    router.push('/login')



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

                                    <Button
                                        type="submit"
                                        disabled={loading || !!success}
                                        className="btn-[#000] my-auto text-[1.2rem] h-[4rem]"
                                    >
                                        {(loading) ? <Loader /> : 'SUBMIT'}
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

export default forgotPassword;

type PageProps = {
    user?: jwtUser
}

export async function getServerSideProps(context: any) {

    const pageProps: PageProps = {}
    const { token } = parseCookies(context);

    if (token) {
        // redirectUser(context, '/');
        pageProps.user = jwtDecode<jwtUser>(token);
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

