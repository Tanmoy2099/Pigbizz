import React, { ReactNode } from 'react'

type Props = {
    id: string;
    children: ReactNode;
    className?: string;
    show?: boolean;
}

const Modal = ({ show = true, ...props }: Props) => {
    return (
        <>
            <input type="checkbox" id={props.id} className="modal-toggle" />
            <div className="modal">
                {/* <div className={`modal-box ${props.className}`}> */}
                <div className={`modal-box relative ${props.className}`}>
                    {show && <label htmlFor={props.id} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>}
                    {props.children}

                </div>
                {/* </div> */}
            </div>
        </>
    )
}

export default Modal;