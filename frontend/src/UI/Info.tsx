import React from 'react'

type Props = {
    image: string;
    alt: string;
    title: string;
    price: string;
}

const Info = ({ image, alt, title, price }: Props) => {
    return (
        <>
            <div className='grid grid-cols-2'>
                <img src={image} alt={alt} />
                <div className='flex flex-col justify-evenly'>
                    <p className='text-[1.2rem] leading-[1.5rem] text-black/[0.5] m-auto mt-2'>{title}</p>
                    <p className='text-[2rem] leading-[2.3rem] m-auto'>{price}</p>
                </div>
            </div>
        </>
    )
}

export default Info;