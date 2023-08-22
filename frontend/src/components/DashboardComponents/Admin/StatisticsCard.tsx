import CardLayout from '@/UI/Card/CardLayout';
import Info from '@/UI/Info';
import React from 'react'

type Props = {} // price, growth percentage

const StatisticsCard = (props: Props) => {
    return (
        <>
            <CardLayout className='h-[19rem] col-span-2'>
                <div className="card-body">
                    <h2 className="card-title-80 text-[2.2rem] leading-[2.7rem]">
                        Statistics Card
                    </h2>
                    <p className='text-[1.4rem] leading-[1.7rem] font-light mt-3' style={{ color: 'rgba(0, 0, 0, 0.7)' }}>Total 48.5% growth this month</p>

                    <div className='flex justify-between gap-20'>
                        <Info image={"/images/arrowGrowth.svg"} alt="arrow growth" title="Sales" price='157k' />
                        <Info image={"/images/productCatalog.svg"} alt="product catalog" title="Products" price='157k' />
                        <Info image={"/images/doller.svg"} alt="doller" title="Revenue" price='157k' />
                    </div>
                </div>
            </CardLayout>
        </>
    )
}

export default StatisticsCard;