import React from 'react';
import CardLayout from '@/UI/Card/CardLayout';
import Image from 'next/image';

type Props = {}

const TotalProduct = (props: Props) => {
    return (
        <>
            <CardLayout className='h-[19rem]  col-span-4 p-8 flex justify-between'>
                <div className='flex flex-row gap-9 items-center'>
                    <h1 className='text-[2.2rem] leading-10 w-fit'>Total product</h1>
                    <Image src="images/pigGift.svg" alt="pigGift" width={73} height={48} />
                </div>
                <div className='flex flex-row justify-between items-center w-[80%]'>
                    <CardLayout className='h-[8.8rem] w-[13.6rem] flex justify-evenly items-center'>
                        <h1 className='text-[1.2rem] text-center'>Male Pig</h1>
                        <h1 className='text-[2rem] text-primary text-center'>2578</h1>
                    </CardLayout>
                    <CardLayout className='h-[8.8rem] w-[13.6rem] flex justify-evenly items-center'>
                        <h1 className='text-[1.2rem] text-center'>Female Pig</h1>
                        <h1 className='text-[2rem] text-primary text-center'>2578</h1>
                    </CardLayout>
                    <CardLayout className='h-[8.8rem] w-[13.6rem] flex justify-evenly items-center'>
                        <h1 className='text-[1.2rem] text-center'>Piglet</h1>
                        <h1 className='text-[2rem] text-primary text-center'>247</h1>
                    </CardLayout>
                </div>
            </CardLayout>
        </>
    )
}

export default TotalProduct;