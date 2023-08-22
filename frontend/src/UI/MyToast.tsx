import React from 'react';
import { ToastContainer, toast, ToastOptions } from "react-toastify";
// import { ToastOptions } from 'react-toastify/dist/types';

type Props = {
    type: string,
    message: string,
}

const MyToast = (props: Props) => {



    const toastSettings: ToastOptions = {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

    switch (props.type) {
        case 'error': {
            toast.error(props.message, toastSettings);
            break;
        }
        case 'success': {
            toast.success(props.message, toastSettings);
            break;
        }
            break;
        case 'warning ': {
            toast.warn(props.message, toastSettings);
            break;
        }
        default: {
            toast.info(props.message, toastSettings);
        }

    }

    return (
        <ToastContainer style={{ fontSize: '1.5rem' }} />
    )
}

export default MyToast;