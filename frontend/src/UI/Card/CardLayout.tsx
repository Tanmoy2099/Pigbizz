import React, { ReactNode } from 'react';
import classes from './CardLayout.module.css';

type Props = {
    children: ReactNode,
    className?: string,
}

const CardLayout = (props: Props) => {
    return (
        <div className={`card rounded-md bg-white ${classes.boxShadow} ${props.className}`} >
            {props.children}
        </div>
    )
}

export default CardLayout;