import React from 'react'
import CardLayout from '@/UI/Card/CardLayout';
import { BiErrorCircle } from 'react-icons/bi';

type Props = {}

const StockStatus = (props: Props) => {
    return (
        <>
            <CardLayout className='col-span-4 md:col-span-3 p-6'>
                <h1 className='text-[2.2rem] mb-6'>Stock status</h1>
                <h3 className='text-[1.4rem] mb-4'>Total <span className='text-red-700 opacity-100'> 125kg </span> items required</h3>
                <div className='flex gap-8 '>

                    <div className='flex flex-row '>
                        <img className='h-full aspect-square' src="/images/medicineSqr.svg" alt="medicine" />

                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between text-lg p-2'>
                                <h1 className='text-2xl '>Medicine<span className='opacity-70'>(Pieces)</span></h1>
                                <div className="tooltip bg-white flex items-center" data-tip="message">
                                    <BiErrorCircle className='text-red-600 m-auto' />
                                </div>
                            </div>
                            <h1 className='text-[1.8rem] pl-2'>157k</h1>
                        </div>
                    </div>


                    <div className='flex flex-row '>
                        <img className='h-full aspect-square' src="/images/feedSqr.svg" alt="feed" />

                        <div className='flex flex-col'>
                            <div className='flex flex-row text-lg p-2'>
                                <h1>Feed<span className='opacity-70'>(kg)</span></h1>
                                <div className="tooltip bg-white flex items-center" data-tip="message">
                                    <BiErrorCircle className='text-red-600 m-auto' />
                                </div>
                            </div>
                            <h1 className='text-[1.8rem] pl-2'>5</h1>
                        </div>
                    </div>



                </div>
            </CardLayout>
        </>
    )
}

export default StockStatus;