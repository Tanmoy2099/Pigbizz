import React, { useState } from "react";
import SignInUpBackground from "@/UI/signInUpBackground/SignInUpBackground";
import { TextInput } from "@/UI/input/TextInput";
// import { Form, FormikProps } from "formik";
import { useField, Form, FormikProps, Formik } from "formik";
import Button from "@/UI/Button/Button";

import { axiosHandler } from "@/utils/axiosHandler";
import MyToast from "@/UI/MyToast";
import { redirectUser } from "@/utils/redirectUser";
import { useRouter } from "next/router";
// import { parseCookies } from "nookies";
import { InferGetServerSidePropsType } from "next";
import jwtDecode, { JwtPayload } from "jwt-decode";
import Loader from "@/UI/Loader/Loader";
import { object, ref, string } from "yup";
import { jwtUser } from "@/types/auth";

interface Values {
    password: string;
    confirmPassword: string;
}


function forgotPassword(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { token } = router.query;

    const validationSchema = object({
        password: string().required('Password is required').min(6, 'Password is too short'),
        confirmPassword: string().oneOf([ref('password'), undefined], 'Passwords must match')
    });

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
                        className="h-[40rem] w-[38rem] bg-[#fff] bg-opacity-70"
                        title={title}
                    >
                        {/* <TextInput placeholder="Email" type="text" /> */}

                        <Formik
                            initialValues={{
                                password: '',
                                confirmPassword: '',
                            }}
                            enableReinitialize
                            validationSchema={validationSchema}
                            onSubmit={async (values, actions) => {

                                const data = { password: values.password }

                                setError(null)
                                setSuccess(null)
                                setLoading(true)

                                try {
                                    const response = await axiosHandler.post(`/auth/reset-password/${token}`, data)
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
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        className="my-1 text-[1.5rem] bg-[#F5F5F5] mb-[2rem]"
                                    />

                                    <TextInput
                                        placeholder="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
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
    return {
        props: pageProps, // will be passed to the page component as props
    };
}

