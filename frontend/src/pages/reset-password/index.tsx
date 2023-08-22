import React from 'react'

type Props = {}

const index = (props: Props) => {
    return (
        <div></div>
    )
}


export default index;


export async function getServerSideProps(context: any) {

    const pageProps = {}

    return {
        redirect: {
            permanent: false,
            destination: "/login",
        },
        props: pageProps,
    }

}
