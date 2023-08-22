import CardLayout from '@/UI/Card/CardLayout';
import EarningPigCard from '@/UI/EarningPigCard';
import React from 'react'

type Props = {}

const TotalEarning = (props: Props) => {

    const totalPrice = "34587"
    return (
        <>
            <CardLayout className='h-[39rem]  col-span-2 md:col-span-1'>
                <div className="card-body gap-10">
                    <h2 className="card-title-80 text-[2.2rem] leading-[2.7rem]">
                        Total Earning
                    </h2>
                    <h2 className="card-title-80 opacity-70 text-[3.4rem] leading-[4.1rem]">
                        ₹ {totalPrice}
                    </h2>
                    <p className='text-[1.2rem] leading-[1.5rem] opacity-70'>Compared to ₹70,548 last year</p>

                    <div className='flex flex-col justify-evenly h-[50%]'>
                        <EarningPigCard imagePath='/images/earningPigtypeIcon.svg' alt='Earning Pig type Icon' title='Male Pig' totalPrice={+totalPrice} cost={24544.25} />

                        <EarningPigCard imagePath='/images/earningPigtypeIcon.svg' alt='Earning Pig type Icon' title='Female Pig' totalPrice={+totalPrice} cost={20544.25} />

                        <EarningPigCard imagePath='/images/earningPigtypeIcon.svg' alt='Earning Pig type Icon' title='Piglet' totalPrice={+totalPrice} cost={10544.25} />
                    </div>
                </div>
            </CardLayout>
        </>
    )
}

export default TotalEarning;