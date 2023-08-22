import React from 'react'
import CardLayout from '@/UI/Card/CardLayout';
import Button from '@/UI/Button/Button';

type Props = {}

const TotalSell = (props: Props) => {
    return (
        <>
            <CardLayout className='h-[19rem]  col-span-2 md:col-span-1'>
                <div className="card-body">
                    <h2 className="card-title-80 text-[2.2rem] leading-[2.7rem]">
                        Total Sell
                    </h2>
                    <p className='text-[1.4rem] leading-[1.7rem] font-light' style={{ color: 'rgba(0, 0, 0, 0.7)' }}>Best seller of the month</p>
                    <p className='text-[2.4rem] leading-[2.9rem] font-medium text-primary'>₹45.25k</p>
                    <div className="card-actions justify-start">
                        <Button type="button" className='btn-[#9155fd] text-[1.3rem] leading-[1.6rem]'>
                            VIEW SALES
                        </Button>
                    </div>
                </div>

                <img className='absolute bottom-0 right-0 max-w-full' src='/images/triangle.svg' alt={'triangle'} />
                <img className='absolute bottom-10 right-10 max-w-full' src='/images/cardpig.svg' alt={'cardpig'} />

            </CardLayout>
        </>
    )
}

export default TotalSell;
